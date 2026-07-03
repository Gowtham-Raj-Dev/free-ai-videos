"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Download, Eye, Heart, Play } from "lucide-react";
import type { VideoMeta } from "@/types";
import { cn, formatCompact, formatDuration, assetPath } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-collection";



const themeGradients: Record<string, string> = {
  nature: "from-emerald-950/80 via-teal-950/90 to-slate-950",
  cinematic: "from-slate-900 via-zinc-950 to-black",
  fantasy: "from-amber-950/80 via-stone-900 to-zinc-950",
  scifi: "from-indigo-950/80 via-slate-900 to-black",
  anime: "from-purple-950/80 via-violet-950 to-slate-950",
  shorts: "from-rose-950/80 via-stone-900 to-zinc-950",
};

export function VideoCard({
  video,
  index = 0,
  priority = false,
}: {
  video: VideoMeta;
  index?: number;
  priority?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false); // currently previewing (playing)
  const [inView, setInView] = useState(false); // near viewport → load poster frame
  const [posterReady, setPosterReady] = useState(false); // first frame available
  const { has, toggle, ready } = useFavorites();
  const fav = ready && has(video.id);

  // Load the video (its first frame becomes a static thumbnail) once the card
  // is near the viewport. On touch devices, also auto-preview the most-visible.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = wrapRef.current;
    if (!el) return;
    const canHover = window.matchMedia("(hover: hover)").matches;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) setInView(true);
        if (!canHover) setActive(e.intersectionRatio > 0.65);
      },
      { threshold: [0, 0.65, 1], rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play on hover/in-view, otherwise hold on the poster frame.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active, posterReady]);



  return (
    <div
      ref={wrapRef}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      className={cn(
        "group relative transition-all duration-700 ease-out",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: `${Math.min(index * 40, 300)}ms` }}
    >
      <Link
        href={`/video/${video.id}`}
        className="block overflow-hidden rounded-2xl glass shadow-lg shadow-black/5 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-brand-500/20"
      >
        <div className={cn(
          "relative aspect-[9/16] w-full overflow-hidden bg-soft bg-gradient-to-br transition-all duration-500",
          themeGradients[video.theme] || "from-slate-900 to-black"
        )}>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />

          {inView && (
            <video
              ref={videoRef}
              // media fragment hints the start frame; we also seek explicitly
              src={`${assetPath(video.src)}#t=0.5`}
              muted
              loop
              playsInline
              preload="metadata"
              // Mobile browsers won't paint a frame from `preload` alone — they
              // only decode one after an explicit seek. Force the seek once
              // metadata is in, then reveal on `seeked` (fires reliably on iOS
              // & Android). `loadeddata` is kept as a desktop fast-path.
              onLoadedMetadata={(e) => {
                if (!active && e.currentTarget.currentTime < 0.4) {
                  try {
                    e.currentTarget.currentTime = 0.5;
                  } catch {
                    /* ignore */
                  }
                }
              }}
              onLoadedData={() => setPosterReady(true)}
              onSeeked={() => setPosterReady(true)}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 z-0",
                posterReady ? "opacity-100" : "opacity-0",
              )}
            />
          )}

          {/* Show loader/spinner until the poster frame is ready */}
          {!posterReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
            </div>
          )}

          {/* Static state play icon (hidden while actively previewing) */}
          {!active && (
            <div className="absolute inset-0 flex items-center justify-center opacity-65 group-hover:opacity-100 transition-opacity z-10">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-black/40 ring-1 ring-white/20">
                <Play size={16} className="translate-x-0.5 fill-white text-white" />
              </span>
            </div>
          )}

          {/* gradient + ring */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10 z-10" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition group-hover:ring-brand-400/40 z-10" />

          {/* top row */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-end p-2.5 z-20">
            <button
              type="button"
              aria-label={fav ? "Remove favorite" : "Add favorite"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle(video.id);
              }}
              className="grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white transition hover:scale-110 cursor-pointer"
            >
              <Heart
                size={15}
                className={cn(fav && "fill-accent-2 text-accent-2")}
              />
            </button>
          </div>

          {/* center play hint */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-black/40 ring-1 ring-white/30">
              <Play size={20} className="translate-x-0.5 fill-white text-white" />
            </span>
          </div>

          {/* duration */}
          <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {formatDuration(video.duration)}
          </span>

          {/* title + stats overlaid on mobile-friendly bottom */}
          <div className="absolute inset-x-0 bottom-0 p-2.5">
            <h3 className="line-clamp-2 text-[13px] font-semibold leading-tight text-white drop-shadow">
              {video.title}
            </h3>
            <div className="mt-1.5 flex items-center gap-3 text-[11px] text-white/80">
              <span className="inline-flex items-center gap-1">
                <Eye size={12} /> {formatCompact(video.views)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Download size={12} /> {formatCompact(video.downloads)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
