import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { findCustomerById, toPublicCustomer, type CustomerProfile } from "@/lib/customers";

const cookieName = "hnh_customer_session";
const sessionLifetime = 60 * 60 * 24 * 30;

function sessionSecret() { return process.env.ADMIN_SESSION_SECRET ?? ""; }
function sign(value: string) { return createHmac("sha256", sessionSecret()).update(`customer:${value}`).digest("hex"); }

export async function customerFromRequest(request: NextRequest): Promise<CustomerProfile | null> {
  const token = request.cookies.get(cookieName)?.value;
  if (!token || !sessionSecret()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  try {
    const value = Buffer.from(payload, "base64url").toString();
    const expected = sign(value);
    if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const session = JSON.parse(value) as { id: string; email: string; issuedAt: number };
    if (!session.id || Date.now() - session.issuedAt < 0 || Date.now() - session.issuedAt > sessionLifetime * 1000) return null;
    const customer = await findCustomerById(session.id);
    if (!customer || customer.email !== session.email) return null;
    return toPublicCustomer(customer);
  } catch { return null; }
}

export function setCustomerSession(response: NextResponse, customer: CustomerProfile) {
  if (!sessionSecret()) throw new Error("Customer account setup is incomplete.");
  const value = JSON.stringify({ id: customer.id, email: customer.email, issuedAt: Date.now() });
  const token = `${Buffer.from(value).toString("base64url")}.${sign(value)}`;
  const production = process.env.NODE_ENV === "production";
  const flags = `Path=/; HttpOnly; SameSite=${production ? "None" : "Lax"}; Max-Age=${sessionLifetime}`;
  response.headers.append("Set-Cookie", `${cookieName}=${token}; ${flags}${production ? "; Secure; Partitioned" : ""}`);
  return response;
}

export function clearCustomerSession(response: NextResponse) {
  const production = process.env.NODE_ENV === "production";
  response.headers.append("Set-Cookie", `${cookieName}=; Path=/; HttpOnly; SameSite=${production ? "None" : "Lax"}; Max-Age=0${production ? "; Secure; Partitioned" : ""}`);
  return response;
}
