import { NextRequest, NextResponse } from "next/server";

const defaults = ["http://localhost:5173", "http://127.0.0.1:5173"];
function allowedOrigin(origin: string | null) {
  if (!origin) return null;
  const allowed = (process.env.STOREFRONT_ORIGIN ?? defaults.join(",")).split(",").map(value => value.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : false;
}
export function isOriginAllowed(request: NextRequest) { return allowedOrigin(request.headers.get("origin")) !== false; }
export function preflight(request: NextRequest) {
  const origin = allowedOrigin(request.headers.get("origin"));
  if (origin === false) return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  const headers = new Headers({ "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "600", "Vary": "Origin" });
  if (origin) headers.set("Access-Control-Allow-Origin", origin);
  return new NextResponse(null, { status: 204, headers });
}
export function publicJson(request: NextRequest, body: unknown, status = 200) {
  const origin = allowedOrigin(request.headers.get("origin"));
  if (origin === false) return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  const response = NextResponse.json(body, { status });
  if (origin) response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Vary", "Origin");
  return response;
}
