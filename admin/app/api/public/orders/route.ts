import { NextRequest } from "next/server";
import { createOrderInquiry, isCustomerBlocked } from "@/lib/store";
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
  const inquiry = { customer: String(body?.customer ?? "").trim(), email: String(body?.email ?? "").trim(), phone: String(body?.phone ?? "").trim(), shippingAddress: String(body?.shippingAddress ?? "").trim(), product: String(body?.product ?? "").trim(), message: String(body?.message ?? "").trim() };
  if (inquiry.customer.length < 2 || inquiry.customer.length > 120 || inquiry.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) || inquiry.phone.length < 6 || inquiry.phone.length > 40 || inquiry.shippingAddress.length < 5 || inquiry.shippingAddress.length > 500 || inquiry.product.length < 2 || inquiry.product.length > 200 || inquiry.message.length > 1500) return publicJson(request, { error: "Check the name, email, phone, address and product fields and try again." }, 422);
  try {
    if (await isCustomerBlocked(inquiry.email, inquiry.phone)) return publicJson(request, { error: "We are unable to accept this enquiry. Please contact our team for assistance." }, 403);
    const order = await createOrderInquiry(inquiry);
    if (order) await notifyNewInquiry(order);
    attempts.set(ip, { count: current && current.reset > Date.now() ? current.count + 1 : 1, reset: current && current.reset > Date.now() ? current.reset : Date.now() + 60 * 60 * 1000 });
    return publicJson(request, { ok: true, orderNumber: order?.orderNumber }, 201);
  } catch { return publicJson(request, { error: "Could not save your enquiry. Please try again." }, 500); }
}
