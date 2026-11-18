import { NextRequest } from "next/server";
import { addSubscriber } from "@/lib/store";
import { isOriginAllowed, preflight, publicJson } from "@/lib/cors";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; reset: number }>();
export function OPTIONS(request: NextRequest) { return preflight(request); }
export async function POST(request: NextRequest) {
  if (!isOriginAllowed(request)) return publicJson(request, { error: "Origin not allowed." }, 403);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const current = attempts.get(ip);
  if (current && current.reset > Date.now() && current.count >= 12) return publicJson(request, { error: "Too many signups. Try again later." }, 429);
  const body = await request.json().catch(() => null) as { email?: unknown; name?: unknown } | null;
  const email = String(body?.email ?? "").trim().toLowerCase();
  const name = String(body?.name ?? "").trim();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return publicJson(request, { error: "Enter a valid email address." }, 422);
  if (name.length > 120) return publicJson(request, { error: "Name is too long." }, 422);
  try {
    const result = await addSubscriber(email, name, "website");
    if (!result.duplicate) attempts.set(ip, { count: current && current.reset > Date.now() ? current.count + 1 : 1, reset: current && current.reset > Date.now() ? current.reset : Date.now() + 60 * 60 * 1000 });
    return publicJson(request, { ok: true, duplicate: result.duplicate });
  } catch { return publicJson(request, { error: "Could not save your signup. Please try again." }, 500); }
}
