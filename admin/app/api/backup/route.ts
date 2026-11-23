import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { collections, listItems } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const user = await isAdmin();
  if (!user || user.role !== "owner") return NextResponse.json({ error: "Only the store owner can download a backup." }, { status: 403 });

  try {
    const data = Object.fromEntries(await Promise.all(
      collections.filter(collection => collection !== "admins").map(async collection => [collection, await listItems(collection)] as const),
    ));
    const date = new Date().toISOString().slice(0, 10);
    return NextResponse.json({ backupVersion: 1, createdAt: new Date().toISOString(), database: "hidenhype", data }, {
      headers: { "Cache-Control": "no-store", "Content-Disposition": `attachment; filename="hide-n-hype-backup-${date}.json"` },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create a backup." }, { status: 500 });
  }
}
