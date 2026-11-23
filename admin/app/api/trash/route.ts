import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { listTrashedProducts, permanentlyDeleteTrashedProduct, restoreTrashedProduct } from "@/lib/store";

export const runtime = "nodejs";

async function canManageTrash() {
  const user = await isAdmin();
  return user && user.role !== "orders_manager" ? user : null;
}

export async function GET() {
  if (!await canManageTrash()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  return NextResponse.json(await listTrashedProducts());
}

export async function PATCH(request: NextRequest) {
  if (!await canManageTrash()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id.trim() : "";
  if (!id) return NextResponse.json({ error: "Product id is required." }, { status: 400 });
  return await restoreTrashedProduct(id)
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Product not found in trash." }, { status: 404 });
}

export async function DELETE(request: NextRequest) {
  if (!await canManageTrash()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const id = request.nextUrl.searchParams.get("id")?.trim();
  if (!id) return NextResponse.json({ error: "Product id is required." }, { status: 400 });
  return await permanentlyDeleteTrashedProduct(id)
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Product not found in trash." }, { status: 404 });
}
