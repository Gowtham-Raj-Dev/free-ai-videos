"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Heart, Share2, Link2, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { VideoMeta } from "@/types";
import { useFavorites, useHistory } from "@/hooks/use-collection";
import { useAuth } from "@/context/auth-context";
import { cn, slugify, assetPath } from "@/lib/utils";

const LIMIT_STORAGE_KEY = "aiv-daily-downloads";

function DownloadLimitModal({ isOpen, onClose, isLoggedIn }: { isOpen: boolean; onClose: () => void; isLoggedIn: boolean }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border border-white/10 text-center animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold mb-3">
          Daily Limit Reached
        </h3>
        <p className="text-muted mb-6 text-sm">
          {isLoggedIn 
            ? "Daily limit complete come back tomorrow. Or you can download premium bundles!"
            : "Daily limit reached login to download videos."}
        </p>
        <div className="flex flex-col gap-3">
          {isLoggedIn ? (
            <a href="https://bundles.codelove.in/bundles" onClick={onClose} className="w-full py-3 rounded-full gradient-brand text-white font-semibold">
              Get Bundles
            </a>
          ) : (
            <a href="https://bundles.codelove.in/profile" onClick={onClose} className="w-full py-3 rounded-full gradient-brand text-white font-semibold">
              Login
            </a>
          )}
          <button onClick={onClose} className="py-2 text-sm text-muted hover:text-white transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function useDownload(video: VideoMeta) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { push } = useHistory();
  const { user } = useAuth();
  
  const isLoggedIn = !!user;
  const limit = isLoggedIn ? 3 : 1;
  const [downloadsToday, setDownloadsToday] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LIMIT_STORAGE_KEY);
      const today = new Date().toDateString();
      if (raw) {
        const data = JSON.parse(raw);
        if (data.date === today) {
          setDownloadsToday(data.count);
        } else {
          localStorage.setItem(LIMIT_STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
          setDownloadsToday(0);
        }
      } else {
        localStorage.setItem(LIMIT_STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
      }
    } catch (e) {}
  }, []);

  const href = assetPath(video.src);
  const filename = `${slugify(video.title)}-${video.id.slice(0, 8)}.mp4`;

  // fires on click
  const onDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (downloadsToday >= limit) {
      e.preventDefault();
      setShowModal(true);
      return;
    }
    
    // Increment local storage
    try {
      const today = new Date().toDateString();
      const newCount = downloadsToday + 1;
      localStorage.setItem(LIMIT_STORAGE_KEY, JSON.stringify({ date: today, count: newCount }));
      setDownloadsToday(newCount);
    } catch (e) {}

    push(video.id);
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return { href, filename, onDownload, loading, showModal, setShowModal, isLoggedIn };
}

export function VideoActions({ video }: { video: VideoMeta }) {
  const { has, toggle, ready } = useFavorites();
  const { href, filename, onDownload, loading, showModal, setShowModal, isLoggedIn } = useDownload(video);
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
        onClick={onDownload}
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

      <DownloadLimitModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        isLoggedIn={isLoggedIn} 
      />
    </div>
  );
}

export function StickyDownloadBar({ video }: { video: VideoMeta }) {
  const { href, filename, onDownload, loading, showModal, setShowModal, isLoggedIn } = useDownload(video);
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
      
      <DownloadLimitModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        isLoggedIn={isLoggedIn} 
      />
    </motion.div>
  );
}
