"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, TrendingUp, Loader2 } from "lucide-react";
import type { VideoMeta } from "@/types";
import { formatCompact, assetPath } from "@/lib/utils";
import { getCatalog, filterVideos } from "./paginated-grid";

const TRENDING = [
  "cinematic",
  "nature",
  "dragon",
  "neon",
  "wolf",
  "anime",
  "shorts",
  "tiger",
];

export const SEARCH_EVENT = "aiv:search-open";
export function openSearch() {
  window.dispatchEvent(new Event(SEARCH_EVENT));
}

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<VideoMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(SEARCH_EVENT, handler);
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener(SEARCH_EVENT, handler);
      window.removeEventListener("keydown", key);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const allVideos = await getCatalog();
        const filtered = filterVideos(allVideos, { q });
        setResults(filtered.slice(0, 12));
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-black/60 backdrop-blur-sm sm:items-start sm:justify-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full flex-col bg-app sm:mx-auto sm:h-auto sm:max-h-[80vh] sm:max-w-2xl sm:rounded-3xl sm:border sm:border-app sm:shadow-2xl"
          >
            {/* input */}
            <div className="flex items-center gap-3 border-b border-app p-4 pt-safe">
              <Search size={20} className="text-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search AI videos…"
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted"
              />
              {loading && <Loader2 size={18} className="animate-spin text-muted" />}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full glass"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!q.trim() && (
                <div>
                  <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted">
                    <TrendingUp size={16} /> Trending searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        onClick={() => setQ(t)}
                        className="rounded-full cursor-pointer glass px-3.5 py-1.5 text-sm capitalize transition hover:text-brand-400"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {q.trim() && results.length === 0 && !loading && (
                <p className="py-12 text-center text-muted">
                  No results for “{q}”.
                </p>
              )}

              <div className="space-y-1.5">
                {results.map((v) => (
                  <Link
                    key={v.id}
                    href={`/video/${v.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-soft"
                  >
                    <video
                      src={assetPath(v.src)}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-16 w-12 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{v.title}</p>
                      <p className="text-xs text-muted">
                        {v.category} · {formatCompact(v.views)} views
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
