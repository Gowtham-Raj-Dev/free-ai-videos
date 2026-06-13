import { NextRequest, NextResponse } from "next/server";
import { getVideoById } from "@/lib/videos";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let ids: string[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.ids)) ids = body.ids.slice(0, 200);
  } catch {
    /* ignore */
  }
  const items = ids
    .map((id) => getVideoById(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  return NextResponse.json({ items });
}
