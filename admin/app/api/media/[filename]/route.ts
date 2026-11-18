import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/i.test(filename)) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  const adminRoot = path.basename(process.cwd()) === "admin" ? process.cwd() : path.join(process.cwd(), "admin");
  const uploadPath = path.join(adminRoot, ".data", "uploads", filename);
  try {
    const image = await readFile(uploadPath);
    const extension = path.extname(filename).slice(1).toLowerCase();
    return new NextResponse(image, {
      headers: {
        "Content-Type": contentTypes[extension],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }
}
