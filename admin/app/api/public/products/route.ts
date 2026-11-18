import { NextRequest } from "next/server";
import { listItems } from "@/lib/store";
import { isOriginAllowed, preflight, publicJson } from "@/lib/cors";

export const runtime = "nodejs";

export function OPTIONS(request: NextRequest) {
  return preflight(request);
}

export async function GET(request: NextRequest) {
  if (!isOriginAllowed(request)) return publicJson(request, { error: "Origin not allowed." }, 403);
  try {
    const products = await listItems("products");
    return publicJson(request, products.filter(product => String(product.status).toLowerCase() === "published"));
  } catch {
    return publicJson(request, { error: "Could not load products." }, 500);
  }
}
