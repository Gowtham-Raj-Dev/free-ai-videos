"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { VideoMeta } from "@/types";
import { VideoCard } from "./video-card";

export function Carousel({ videos }: { videos: VideoMeta[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <div className="group/carousel relative">
      <div
        ref={scroller}
        className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 sm:gap-4"
      >
        {videos.map((v, i) => (
          <div
            key={v.id}
            className="w-[44vw] shrink-0 snap-start sm:w-52 lg:w-56"
          >
            <VideoCard video={v} index={i} priority={i < 3} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className="absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full glass opacity-0 transition group-hover/carousel:opacity-100 md:grid"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full glass opacity-0 transition group-hover/carousel:opacity-100 md:grid"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
