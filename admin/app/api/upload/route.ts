import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isAdmin } from "@/lib/auth";
import { getMediaBucket } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 30;
const types: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" };
export async function POST(request: NextRequest) {
  const user = await isAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role === "orders_manager") return NextResponse.json({ error: "Insufficient role" }, { status: 403 });
  const form = await request.formData(); const file = form.get("file");
  if (!(file instanceof File) || !types[file.type]) return NextResponse.json({ error: "Upload a JPG, PNG, WebP or GIF image." }, { status: 415 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Images must be 5 MB or smaller." }, { status: 413 });
  const filename = `${randomUUID()}${types[file.type]}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const validSignature = file.type === "image/jpeg" ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    : file.type === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : file.type === "image/webp" ? bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP"
    : bytes.toString("ascii", 0, 6) === "GIF87a" || bytes.toString("ascii", 0, 6) === "GIF89a";
  if (!validSignature) return NextResponse.json({ error: "The file content does not match its image type." }, { status: 415 });
  const bucket = await getMediaBucket();
  const upload = bucket.openUploadStream(filename, { metadata: { contentType: file.type, originalName: file.name } });
  await new Promise<void>((resolve, reject) => {
    upload.once("finish", resolve);
    upload.once("error", reject);
    upload.end(bytes);
  });
  return NextResponse.json({ url: `/api/media/${filename}`, name: file.name, size: file.size, mimeType: file.type }, { status: 201 });
}
