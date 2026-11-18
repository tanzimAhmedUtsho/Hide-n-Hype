import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { findAdminByEmail, findAdminById } from "@/lib/store";
import { verifyPassword } from "@/lib/password";

const cookieName = "hnh_admin_session";
export type AdminRole = "owner" | "editor" | "orders_manager";
export type SessionUser = { id: string; email: string; name: string; role: AdminRole };
function secret() { return process.env.ADMIN_SESSION_SECRET ?? ""; }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("hex"); }
export async function authenticateAdmin(email: string, password: string): Promise<SessionUser | null> {
  const user = await findAdminByEmail(email.trim().toLowerCase());
  if (!user || !verifyPassword(password, String(user.password_hash))) return null;
  return { id: String(user.id), email: String(user.email), name: String(user.name), role: String(user.role) as AdminRole };
}
export async function startSession(user: SessionUser) {
  const value = JSON.stringify({ id: user.id, email: user.email.toLowerCase(), issued: Date.now() });
  const jar = await cookies();
  jar.set(cookieName, `${Buffer.from(value).toString("base64url")}.${sign(value)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 12 });
}
export async function isAdmin(): Promise<SessionUser | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !secret()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  try {
    const value = Buffer.from(payload, "base64url").toString();
    const expected = sign(value);
    if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const tokenData = JSON.parse(value) as { id: string; email: string; issued: number };
    if (!tokenData.id || Date.now() - tokenData.issued < 0 || Date.now() - tokenData.issued > 12 * 60 * 60 * 1000) return null;
    const user = await findAdminById(tokenData.id);
    if (!user || String(user.email).toLowerCase() !== tokenData.email.toLowerCase()) return null;
    return { id: String(user.id), email: String(user.email), name: String(user.name), role: String(user.role) as AdminRole };
  } catch { return null; }
}
export async function endSession() { (await cookies()).delete(cookieName); }
