"use client";

import { useState } from "react";
import { Download, Heart, Share2, Link2, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { VideoMeta } from "@/types";
import { useFavorites, useHistory } from "@/hooks/use-collection";
import { cn, slugify, assetPath } from "@/lib/utils";

function useDownload(video: VideoMeta) {
  const [loading, setLoading] = useState(false);
  const { push } = useHistory();

  const href = assetPath(video.src);
  const filename = `${slugify(video.title)}-${video.id.slice(0, 8)}.mp4`;

  // fires on click without preventing the native download
  const onDownload = () => {
    push(video.id);
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return { href, filename, onDownload, loading };
}

export function VideoActions({ video }: { video: VideoMeta }) {
  const { has, toggle, ready } = useFavorites();
  const { href, filename, onDownload, loading } = useDownload(video);
  const [copied, setCopied] = useState(false);
  const fav = ready && has(video.id);

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: video.title, url });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    copyLink();
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <a
        href={href}
        download={filename}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full gradient-brand px-6 py-3 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:opacity-95 sm:flex-none cursor-pointer"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Download size={18} />
        )}
        {loading ? "Downloading…" : "Download Free"}
      </a>

      <button
        onClick={() => toggle(video.id)}
        aria-label="Favorite"
        className="grid h-12 w-12 place-items-center rounded-full glass transition hover:scale-105 cursor-pointer"
      >
        <Heart size={19} className={cn(fav && "fill-accent-2 text-accent-2")} />
      </button>

      <button
        onClick={share}
        aria-label="Share"
        className="grid h-12 w-12 place-items-center rounded-full glass transition hover:scale-105 cursor-pointer"
      >
        <Share2 size={19} />
      </button>

      <button
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-full glass px-4 py-3 text-sm font-medium transition hover:scale-[1.02] cursor-pointer"
      >
        {copied ? (
          <Check size={17} className="text-green-400" />
        ) : (
          <Link2 size={17} />
        )}
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}

export function StickyDownloadBar({ video }: { video: VideoMeta }) {
  const { href, filename, onDownload, loading } = useDownload(video);
  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 bottom-16 z-40 px-3 md:hidden"
    >
      <a
        href={href}
        download={filename}
        onClick={onDownload}
        className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand py-3.5 font-semibold text-white shadow-2xl shadow-brand-500/40 cursor-pointer"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Download size={18} />
        )}
        Download Free · HD
      </a>
    </motion.div>
  );
}
