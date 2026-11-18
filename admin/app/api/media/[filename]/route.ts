import { NextResponse } from "next/server";
import { getMediaBucket } from "@/lib/db";

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

  try {
    const bucket = await getMediaBucket();
    const [file] = await bucket.find({ filename }).sort({ uploadDate: -1 }).limit(1).toArray();
    if (!file) return NextResponse.json({ error: "Image not found." }, { status: 404 });
    const chunks: Buffer[] = [];
    for await (const chunk of bucket.openDownloadStream(file._id)) chunks.push(Buffer.from(chunk));
    return new NextResponse(Buffer.concat(chunks), {
      headers: {
        "Content-Type": String(file.metadata?.contentType ?? contentTypes[filename.split(".").pop()?.toLowerCase() ?? ""] ?? "application/octet-stream"),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }
}
