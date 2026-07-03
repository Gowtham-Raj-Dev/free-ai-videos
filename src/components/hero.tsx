"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Flame, Sparkles, Download } from "lucide-react";
import type { VideoMeta } from "@/types";
import { formatCompact, assetPath } from "@/lib/utils";

const themeGradients: Record<string, string> = {
  nature: "from-emerald-950/80 via-teal-950/90 to-slate-950",
  cinematic: "from-slate-900 via-zinc-950 to-black",
  fantasy: "from-amber-950/80 via-stone-900 to-zinc-950",
  scifi: "from-indigo-950/80 via-slate-900 to-black",
  anime: "from-purple-950/80 via-violet-950 to-slate-950",
  shorts: "from-rose-950/80 via-stone-900 to-zinc-950",
};

export function Hero({
  floats,
  totalVideos,
  totalDownloads,
}: {
  floats: VideoMeta[];
  totalVideos: number;
  totalDownloads: number;
}) {
  return (
    <section className="relative overflow-hidden px-4 pt-10 pb-8 sm:px-6 sm:pt-16 sm:pb-12 lg:pb-0">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        {/* copy */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium"
          >
            <Sparkles size={14} className="text-brand-400" />
            {formatCompact(totalDownloads)}+ free downloads · updated daily
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
          >
            AI Generated Videos
            <br />
            <span className="shine-text">Download Premium</span>
            <br className="hidden sm:block" /> AI Videos Free
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted sm:text-lg lg:mx-0"
          >
            Explore {formatCompact(totalVideos)}+ high-quality AI generated
            videos. Free downloads. No watermark. Updated daily.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-7 flex flex-row items-center justify-center gap-3 lg:justify-start"
          >
            <Link
              href="/videos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full gradient-brand px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:scale-[1.02] sm:w-auto sm:px-7 sm:text-base"
            >
              <Play size={18} className="fill-white text-white" />
              <span className="text-white">Browse <span className="hidden sm:inline">Videos</span></span>
            </Link>
            <Link
              href="/trending-ai-videos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full glass px-4 py-3.5 text-sm font-semibold transition hover:scale-[1.02] sm:w-auto sm:px-7 sm:text-base"
            >
              <Flame size={18} className="text-accent-2" />
              <span>Trending <span className="hidden sm:inline">Videos</span></span>
            </Link>
          </motion.div>
        </div>

        {/* floating cards */}
        <div className="relative hidden h-[460px] lg:block">
          {floats.slice(0, 5).map((v, i) => {
            const layout = [
              { x: 40, y: 20, r: -6, s: 1, d: 0 },
              { x: 230, y: 0, r: 5, s: 0.92, d: 0.6 },
              { x: 150, y: 200, r: -3, s: 1.05, d: 1.1 },
              { x: 360, y: 150, r: 7, s: 0.85, d: 1.6 },
              { x: 0, y: 240, r: 4, s: 0.8, d: 2.1 },
            ][i];
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: layout.s, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                style={{ left: layout.x, top: layout.y, rotate: layout.r }}
                className="absolute"
              >
                <motion.div
                  animate={{ y: [0, -14, 0] }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: layout.d,
                  }}
                >
                  <Link
                    href={`/video/${v.id}`}
                    className="relative block h-56 w-32 overflow-hidden rounded-2xl glass shadow-2xl shadow-black/30 [transform:translateZ(0)]"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${themeGradients[v.theme] || "from-slate-900 to-black"}`} />
                    <video
                      src={`${assetPath(v.src)}#t=0.5`}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full rounded-2xl object-cover"
                    />
                    <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur">
                      <Download size={10} /> {formatCompact(v.downloads)}
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
