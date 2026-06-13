"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, History, Download, Trash2, FolderOpen } from "lucide-react";
import type { VideoMeta } from "@/types";
import { useFavorites, useRecent, useHistory } from "@/hooks/use-collection";
import { VideoGrid } from "@/components/video-grid";

type Tab = "favorites" | "recent" | "downloads";

const TABS: { key: Tab; label: string; icon: typeof Heart }[] = [
  { key: "favorites", label: "Favorites", icon: Heart },
  { key: "recent", label: "Recently Viewed", icon: History },
  { key: "downloads", label: "Downloads", icon: Download },
];

export default function ProfilePage() {
  const fav = useFavorites();
  const recent = useRecent();
  const history = useHistory();
  const [tab, setTab] = useState<Tab>("favorites");
  const [videos, setVideos] = useState<Record<string, VideoMeta>>({});

  const collections = { favorites: fav, recent, downloads: history };
  const active = collections[tab];

  // fetch metadata for any ids we don't have yet
  useEffect(() => {
    const allIds = [...fav.ids, ...recent.ids, ...history.ids];
    const missing = allIds.filter((id) => !videos[id]);
    if (missing.length === 0) return;
    fetch("/api/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: missing }),
    })
      .then((r) => r.json())
      .then((data: { items: VideoMeta[] }) => {
        setVideos((prev) => {
          const next = { ...prev };
          for (const v of data.items) next[v.id] = v;
          return next;
        });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fav.ids, recent.ids, history.ids]);

  const list = active.ids
    .map((id) => videos[id])
    .filter((v): v is VideoMeta => Boolean(v));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Library
          </h1>
          <p className="mt-1 text-muted">
            Your saved, viewed and downloaded AI videos — stored on this device.
          </p>
        </div>
        {active.ids.length > 0 && (
          <button
            onClick={active.clear}
            className="inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-2 text-sm text-muted transition hover:text-accent-2"
          >
            <Trash2 size={15} /> Clear
          </button>
        )}
      </header>

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const count = collections[t.key].ids.length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === t.key ? "gradient-brand text-white" : "glass text-muted"
              }`}
            >
              <Icon size={16} /> {t.label}
              {count > 0 && (
                <span className="rounded-full bg-black/20 px-1.5 text-xs">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {active.ready && list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center text-muted">
          <FolderOpen size={44} className="opacity-50" />
          <p>Nothing here yet.</p>
          <Link
            href="/videos"
            className="rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse AI Videos
          </Link>
        </div>
      ) : (
        <VideoGrid videos={list} />
      )}
    </div>
  );
}
