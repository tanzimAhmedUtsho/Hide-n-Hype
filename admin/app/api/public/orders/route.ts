import { NextRequest } from "next/server";
import { createOrderInquiry, findPublishedLandingPage, isCustomerBlocked } from "@/lib/store";
import { notifyNewInquiry } from "@/lib/notifications";
import { isOriginAllowed, preflight, publicJson } from "@/lib/cors";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; reset: number }>();
export function OPTIONS(request: NextRequest) { return preflight(request); }
export async function POST(request: NextRequest) {
  if (!isOriginAllowed(request)) return publicJson(request, { error: "Origin not allowed." }, 403);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const current = attempts.get(ip);
  if (current && current.reset > Date.now() && current.count >= 8) return publicJson(request, { error: "Too many order enquiries. Please try again later." }, 429);
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const landingPageSlug = String(body?.landingPageSlug ?? "").trim();
  const tracking = { utmSource: String(body?.utmSource ?? "").trim().slice(0, 120), utmMedium: String(body?.utmMedium ?? "").trim().slice(0, 120), utmCampaign: String(body?.utmCampaign ?? "").trim().slice(0, 120) };
  const inquiry = { customer: String(body?.customer ?? "").trim(), email: String(body?.email ?? "").trim(), phone: String(body?.phone ?? "").trim(), shippingAddress: String(body?.shippingAddress ?? "").trim(), product: String(body?.product ?? "").trim(), message: String(body?.message ?? "").trim() };
  const isLandingPageEnquiry = Boolean(landingPageSlug);
  if (landingPageSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(landingPageSlug)) return publicJson(request, { error: "Invalid landing page." }, 422);
  const invalid = inquiry.customer.length < 2 || inquiry.customer.length > 120 || inquiry.email.length > 254 || Boolean(inquiry.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) || !isLandingPageEnquiry && inquiry.email.length === 0 || inquiry.phone.length < 6 || inquiry.phone.length > 40 || (isLandingPageEnquiry ? inquiry.shippingAddress.length > 500 : inquiry.shippingAddress.length < 5 || inquiry.shippingAddress.length > 500) || inquiry.product.length < 2 || inquiry.product.length > 200 || inquiry.message.length > 1500;
  if (invalid) return publicJson(request, { error: "Check the name, email, phone and product details, then try again." }, 422);
  try {
    if (await isCustomerBlocked(inquiry.email, inquiry.phone)) return publicJson(request, { error: "We are unable to accept this enquiry. Please contact our team for assistance." }, 403);
    const landingPage = landingPageSlug ? await findPublishedLandingPage(landingPageSlug) : null;
    if (landingPageSlug && !landingPage) return publicJson(request, { error: "This landing page is no longer available." }, 404);
    const order = await createOrderInquiry({ ...inquiry, ...tracking, landingPageSlug: landingPage ? landingPageSlug : undefined, landingPageTitle: landingPage ? String(landingPage.title ?? "") : undefined });
    if (order) await notifyNewInquiry(order);
    attempts.set(ip, { count: current && current.reset > Date.now() ? current.count + 1 : 1, reset: current && current.reset > Date.now() ? current.reset : Date.now() + 60 * 60 * 1000 });
    return publicJson(request, { ok: true, orderNumber: order?.orderNumber }, 201);
  } catch { return publicJson(request, { error: "Could not save your enquiry. Please try again." }, 500); }
}
