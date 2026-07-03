import { NextResponse } from "next/server";
import { getAllVideos } from "@/lib/videos";

export const dynamic = "force-static";

export async function GET() {
  const list = getAllVideos();
  return NextResponse.json(list);
}
