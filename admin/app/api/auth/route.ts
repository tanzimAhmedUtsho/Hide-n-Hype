import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, endSession, isAdmin, startSession } from "@/lib/auth";
import { listItems } from "@/lib/store";

const attempts = new Map<string, { count: number; reset: number }>();
export async function GET() {
  const user = await isAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const team = (await listItems("admins"))
    .filter(member => String(member.status ?? "").toLowerCase() === "active")
    .map(member => ({ id: String(member.id), name: String(member.name ?? "Store admin"), role: String(member.role ?? "editor") }));
  return NextResponse.json({ user: { id: user.id, name: user.name, role: user.role }, team });
}
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const current = attempts.get(ip);
  if (current && current.reset > Date.now() && current.count >= 8) return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  let body: { email?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (String(body.email ?? "").length > 254 || String(body.password ?? "").length > 256) return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
  if (!process.env.ADMIN_SESSION_SECRET) return NextResponse.json({ error: "Admin setup is incomplete. Configure ADMIN_SESSION_SECRET and create an initial owner account." }, { status: 503 });
  const user = await authenticateAdmin(String(body.email ?? ""), String(body.password ?? ""));
  if (!user) {
    attempts.set(ip, { count: current && current.reset > Date.now() ? current.count + 1 : 1, reset: current && current.reset > Date.now() ? current.reset : Date.now() + 10 * 60 * 1000 });
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }
  attempts.delete(ip); await startSession(user);
  return NextResponse.json({ ok: true, user: { email: user.email, name: user.name, role: user.role } });
}
export async function DELETE() { await endSession(); return NextResponse.json({ ok: true }); }
