"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, SearchX } from "lucide-react";
import type { VideoMeta } from "@/types";
import { VideoCard } from "./video-card";
import { cn, assetPath } from "@/lib/utils";

const PAGE_SIZE = 20;

export interface GridQuery {
  q?: string;
  category?: string;
  sort?: string;
  ids?: string;
  kind?: string;
  theme?: string;
  categorySort?: string;
}

let cachedCatalog: VideoMeta[] | null = null;
export async function getCatalog(): Promise<VideoMeta[]> {
  if (cachedCatalog) return cachedCatalog;
  try {
    const res = await fetch(assetPath("/api/videos-catalog"));
    cachedCatalog = await res.json();
    return cachedCatalog ?? [];
  } catch (err) {
    console.error("Failed to load videos catalog", err);
    return [];
  }
}

export function filterVideos(all: VideoMeta[], query: GridQuery): VideoMeta[] {
  let list = [...all];
  const q = query.q?.trim().toLowerCase();
  const category = query.category?.trim();
  const sort = query.sort ?? "latest";
  const ids = query.ids?.trim();

  if (ids) {
    const idSet = new Set(ids.split("|"));
    list = list.filter((v) => idSet.has(v.id));
  } else if (q) {
    list = list
      .map((v) => {
        const hay = `${v.title} ${v.category} ${v.theme} ${v.tags.join(" ")}`.toLowerCase();
        let s = 0;
        if (v.title.toLowerCase().includes(q)) s += 10;
        if (hay.includes(q)) s += 5;
        for (const word of q.split(/\s+/)) {
          if (hay.includes(word)) s += 1;
        }
        return { v, s };
      })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || b.v.score - a.v.score)
      .map((x) => x.v);
  } else if (category) {
    if (query.kind === "all" || query.kind === "sort") {
      // do not filter by categorySlug for meta categories
    } else if (query.kind === "theme") {
      list = list.filter((v) => v.theme === query.theme);
    } else {
      list = list.filter((v) => v.categorySlug === category);
    }
  }

  // Sort
  if (!q) {
    const activeSort = query.kind === "sort" && query.categorySort ? query.categorySort : sort;
    switch (activeSort) {
      case "views":
      case "popular":
        list.sort((a, b) => b.views - a.views);
        break;
      case "downloads":
        list.sort((a, b) => b.downloads - a.downloads);
        break;
      case "trending":
        list.sort((a, b) => b.score - a.score);
        break;
      case "latest":
        list.sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));
        break;
      default:
        // For folders, default sort by title. For 'all' or 'theme', default to score.
        if (query.kind === "folder" || (!query.kind && category)) {
          list.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
        } else {
          list.sort((a, b) => b.score - a.score);
        }
    }
  }

  return list;
}

export function PaginatedGrid({
  initial = [],
  initialTotal = 0,
  query,
  emptyLabel = "No videos found.",
}: {
  initial?: VideoMeta[];
  initialTotal?: number;
  query: GridQuery;
  emptyLabel?: string;
}) {
  const [items, setItems] = useState<VideoMeta[]>(initial);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const firstRender = useRef(true);
  const queryKey = JSON.stringify(query);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const load = useCallback(
    async (p: number, scroll: boolean) => {
      setLoading(true);
      try {
        const allVideos = await getCatalog();
        const filtered = filterVideos(allVideos, query);
        
        const start = (p - 1) * PAGE_SIZE;
        const pageItems = filtered.slice(start, start + PAGE_SIZE);
        
        setItems(pageItems);
        setTotal(filtered.length);
        setPage(p);
        
        if (scroll) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  // reload from page 1 whenever the query changes (skip the very first mount,
  // which already has server-provided `initial` data)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (initial.length > 0) return;
    }
    load(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages || p === page || loading) return;
    load(p, true);
  };

  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center text-muted">
        <SearchX size={40} className="opacity-50" />
        <p>{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((v, i) => (
          <VideoCard key={v.id} video={v} index={i} priority={i < 4} />
        ))}

        {loading && (
          <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-app/60 backdrop-blur-sm">
            <Loader2 className="animate-spin text-brand-400" size={32} />
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          onChange={goTo}
          disabled={loading}
        />
      )}
    </div>
  );
}

function pageWindow(page: number, totalPages: number): (number | "…")[] {
  const out: (number | "…")[] = [];
  const add = (n: number | "…") => out.push(n);
  const range = 1; // neighbours on each side

  add(1);
  if (page - range > 2) add("…");
  for (
    let i = Math.max(2, page - range);
    i <= Math.min(totalPages - 1, page + range);
    i++
  ) {
    add(i);
  }
  if (page + range < totalPages - 1) add("…");
  if (totalPages > 1) add(totalPages);
  return out;
}

function Pagination({
  page,
  totalPages,
  total,
  onChange,
  disabled,
}: {
  page: number;
  totalPages: number;
  total: number;
  onChange: (p: number) => void;
  disabled: boolean;
}) {
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(page - 1)}
          disabled={disabled || page === 1}
          aria-label="Previous page"
          className="grid h-10 w-10 place-items-center rounded-full glass transition disabled:opacity-40 enabled:hover:text-brand-400"
        >
          <ChevronLeft size={18} />
        </button>

        {pageWindow(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`e-${i}`} className="px-1.5 text-muted">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              disabled={disabled}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition",
                p === page
                  ? "gradient-brand text-white shadow-lg shadow-brand-500/30"
                  : "glass text-muted hover:text-foreground",
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={disabled || page === totalPages}
          aria-label="Next page"
          className="grid h-10 w-10 place-items-center rounded-full glass transition disabled:opacity-40 enabled:hover:text-brand-400"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <p className="text-xs text-muted">
        Showing {start}–{end} of {total} videos · Page {page} of {totalPages}
      </p>
    </div>
  );
}
