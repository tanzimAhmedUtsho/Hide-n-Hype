import { NextRequest, NextResponse } from "next/server";
import { changeCustomerPassword, createCustomer, updateCustomerProfile, verifyCustomerPassword } from "@/lib/customers";
import { clearCustomerSession, customerFromRequest, setCustomerSession } from "@/lib/customer-auth";
import { isOriginAllowed } from "@/lib/cors";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; reset: number }>();
const divisions = ["Barishal", "Chattogram", "Dhaka", "Khulna", "Mymensingh", "Rajshahi", "Rangpur", "Sylhet"];

function json(request: NextRequest, body: unknown, status = 200) {
  const response = NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", Vary: "Origin" } });
  const origin = request.headers.get("origin");
  if (origin) { response.headers.set("Access-Control-Allow-Origin", origin); response.headers.set("Access-Control-Allow-Credentials", "true"); }
  return response;
}

export function OPTIONS(request: NextRequest) {
  if (!isOriginAllowed(request)) return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  const response = new NextResponse(null, { status: 204, headers: { "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "600", Vary: "Origin" } });
  const origin = request.headers.get("origin");
  if (origin) { response.headers.set("Access-Control-Allow-Origin", origin); response.headers.set("Access-Control-Allow-Credentials", "true"); }
  return response;
}

export async function GET(request: NextRequest) {
  if (!isOriginAllowed(request)) return json(request, { error: "Origin not allowed." }, 403);
  const customer = await customerFromRequest(request);
  return json(request, customer ? { authenticated: true, profile: customer } : { authenticated: false });
}

export async function POST(request: NextRequest) {
  if (!isOriginAllowed(request)) return json(request, { error: "Origin not allowed." }, 403);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const current = attempts.get(ip);
  if (current && current.reset > Date.now() && current.count >= 8) return json(request, { error: "Too many attempts. Please try again later." }, 429);
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return json(request, { error: "Invalid request." }, 400);
  if (!process.env.ADMIN_SESSION_SECRET) return json(request, { error: "Account service is not configured yet." }, 503);
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length > 256) return json(request, { error: "Enter a valid email and password." }, 422);

  try {
    let customer;
    if (body.mode === "register") {
      const profile = {
        name: String(body.name ?? "").trim(), phone: String(body.phone ?? "").trim(),
        division: String(body.division ?? "").trim(), district: String(body.district ?? "").trim(),
        postalCode: String(body.postalCode ?? "").trim(), address: String(body.address ?? "").trim(),
      };
      if (password.length < 12) return json(request, { error: "Use a password with at least 12 characters." }, 422);
      if (profile.name.length < 2 || profile.name.length > 120 || profile.phone.length < 6 || profile.phone.length > 40 || !divisions.includes(profile.division) || profile.district.length < 2 || profile.district.length > 120 || profile.postalCode.length > 20 || profile.address.length < 5 || profile.address.length > 500) return json(request, { error: "Complete your name, phone and address details." }, 422);
      customer = await createCustomer({ email, password, ...profile });
    } else if (body.mode === "login") {
      customer = await verifyCustomerPassword(email, password);
      if (!customer) {
        attempts.set(ip, { count: current && current.reset > Date.now() ? current.count + 1 : 1, reset: current && current.reset > Date.now() ? current.reset : Date.now() + 15 * 60 * 1000 });
        return json(request, { error: "Email or password is incorrect." }, 401);
      }
    } else return json(request, { error: "Choose sign in or create account." }, 422);

    attempts.delete(ip);
    return setCustomerSession(json(request, { authenticated: true, profile: customer }), customer);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) return json(request, { error: "An account already exists for this email. Sign in instead." }, 409);
    console.error("Customer account request failed:", error);
    return json(request, { error: "We could not connect to the account service. Please try again shortly." }, 503);
  }
}

export async function PATCH(request: NextRequest) {
  if (!isOriginAllowed(request)) return json(request, { error: "Origin not allowed." }, 403);
  const customer = await customerFromRequest(request);
  if (!customer) return json(request, { error: "Sign in to update your profile." }, 401);
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return json(request, { error: "Invalid request." }, 400);
  if (body.action === "change-password") {
    const currentPassword = String(body.currentPassword ?? ""); const nextPassword = String(body.newPassword ?? "");
    if (nextPassword.length < 12 || nextPassword.length > 256) return json(request, { error: "Your new password must be at least 12 characters." }, 422);
    const changed = await changeCustomerPassword(customer.id, currentPassword, nextPassword);
    return changed ? json(request, { ok: true }) : json(request, { error: "Current password is incorrect." }, 422);
  }
  const profile = {
    name: String(body.name ?? "").trim(), phone: String(body.phone ?? "").trim(),
    division: String(body.division ?? "").trim(), district: String(body.district ?? "").trim(),
    postalCode: String(body.postalCode ?? "").trim(), address: String(body.address ?? "").trim(),
  };
  if (profile.name.length < 2 || profile.name.length > 120 || profile.phone.length < 6 || profile.phone.length > 40 || !divisions.includes(profile.division) || profile.district.length < 2 || profile.district.length > 120 || profile.postalCode.length > 20 || profile.address.length < 5 || profile.address.length > 500) return json(request, { error: "Complete your name, phone and address details." }, 422);
  const updated = await updateCustomerProfile(customer.id, profile);
  return updated ? json(request, { authenticated: true, profile: updated }) : json(request, { error: "Customer account not found." }, 404);
}

export async function DELETE(request: NextRequest) {
  if (!isOriginAllowed(request)) return json(request, { error: "Origin not allowed." }, 403);
  return clearCustomerSession(json(request, { ok: true }));
}
