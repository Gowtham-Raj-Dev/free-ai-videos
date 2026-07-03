import { NextRequest, NextResponse } from "next/server";
import {
  getAllVideos,
  getVideosForCategory,
  searchVideos,
} from "@/lib/videos";
import { getCategory } from "@/lib/categories";
import type { VideoMeta } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const idsParam = sp.get("ids")?.trim();
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
  const maxLimit = idsParam ? 1000 : 60;
  const limit = Math.min(maxLimit, Math.max(1, parseInt(sp.get("limit") ?? "24", 10) || 24));
  const q = sp.get("q")?.trim() ?? "";
  const category = sp.get("category")?.trim() ?? "";
  const sort = sp.get("sort") ?? "latest";

  let list: VideoMeta[];

  if (idsParam) {
    const idSet = new Set(idsParam.split("|"));
    list = getAllVideos().filter((v) => idSet.has(v.id));
  } else if (q) {
    list = searchVideos(q, 1000);
  } else if (category) {
    const def = getCategory(category);
    list = def ? getVideosForCategory(def) : getAllVideos();
  } else {
    list = getAllVideos();
  }

  if (!q && (!category || getCategory(category)?.kind !== "sort")) {
    list = [...list];
    switch (sort) {
      case "views":
        list.sort((a, b) => b.views - a.views);
        break;
      case "downloads":
        list.sort((a, b) => b.downloads - a.downloads);
        break;
      case "trending":
        list.sort((a, b) => b.score - a.score);
        break;
      case "latest":
      default:
        list.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
    }
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const items = list.slice(start, start + limit);

  return NextResponse.json({
    items,
    page,
    limit,
    total,
    hasMore: start + limit < total,
  });
}
