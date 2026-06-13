import { NextRequest, NextResponse } from "next/server";
import { increment } from "@/lib/store";
import { getVideoById } from "@/lib/videos";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let id: string | undefined;
  try {
    const body = await req.json();
    id = body?.id;
  } catch {
    /* ignore */
  }
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const video = getVideoById(id);
  if (!video) return NextResponse.json({ ok: false }, { status: 404 });
  const rec = increment(id, "views", video.title);
  return NextResponse.json({ ok: true, views: video.views, delta: rec.views });
}
