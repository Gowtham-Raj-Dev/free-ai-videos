import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { increment } from "@/lib/store";
import { getVideoById } from "@/lib/videos";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  // the client requests `…/<id>.mp4` so download managers that name files from
  // the URL path still get a .mp4; strip the suffix before lookup (ids never
  // contain dots — they're the filename minus its extension)
  const id = rawId.replace(/\.(mp4|webm|mov)$/i, "");
  const video = getVideoById(id);
  if (!video) return NextResponse.json({ ok: false }, { status: 404 });

  // resolve the on-disk path from the public src
  const rel = video.src
    .split("/")
    .filter(Boolean)
    .map((seg) => decodeURIComponent(seg));
  const filePath = path.join(process.cwd(), "public", ...rel);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  increment(id, "downloads", video.title);

  const data = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1) || "mp4";
  const fileName = `${slugify(video.title)}-${id.slice(0, 8)}.${ext}`;

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": `video/${ext === "mov" ? "quicktime" : ext}`,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": String(data.length),
      "Cache-Control": "no-store",
    },
  });
}
