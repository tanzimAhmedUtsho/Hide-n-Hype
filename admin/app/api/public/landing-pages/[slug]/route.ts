import { NextRequest } from "next/server";
import { findPublishedLandingPage } from "@/lib/store";
import { isOriginAllowed, preflight, publicJson } from "@/lib/cors";

export const runtime = "nodejs";

export function OPTIONS(request: NextRequest) { return preflight(request); }

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!isOriginAllowed(request)) return publicJson(request, { error: "Origin not allowed." }, 403);
  try {
    const { slug } = await context.params;
    const page = await findPublishedLandingPage(slug);
    return page ? publicJson(request, page, 200) : publicJson(request, { error: "Landing page not found." }, 404);
  } catch {
    return publicJson(request, { error: "Could not load this landing page." }, 503);
  }
}
