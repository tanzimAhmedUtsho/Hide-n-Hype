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
    const members = await listItems("team");
    const published = members
      .filter(member => String(member.status ?? "active").toLowerCase() === "active")
      .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
      .map(({ id, name, designation, location, image, bio, sortOrder }) => ({ id, name, designation, location, image, bio, sortOrder }));
    return publicJson(request, published);
  } catch {
    return publicJson(request, { error: "Could not load team members." }, 500);
  }
}
