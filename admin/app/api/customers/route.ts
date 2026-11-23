import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteCustomer, listCustomers } from "@/lib/customers";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!['owner', 'orders_manager'].includes(admin.role)) {
    return NextResponse.json({ error: "You do not have access to customer profiles." }, { status: 403 });
  }

  try {
    return NextResponse.json(await listCustomers(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Could not load customer profiles:", error);
    return NextResponse.json({ error: "Could not load customer profiles." }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (admin.role !== "owner") return NextResponse.json({ error: "Only the owner can delete customer accounts." }, { status: 403 });

  const id = request.nextUrl.searchParams.get("id")?.trim();
  if (!id) return NextResponse.json({ error: "Customer id is required." }, { status: 400 });

  try {
    return await deleteCustomer(id)
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "Customer account not found." }, { status: 404 });
  } catch (error) {
    console.error("Could not delete customer account:", error);
    return NextResponse.json({ error: "Could not delete this customer account." }, { status: 503 });
  }
}
