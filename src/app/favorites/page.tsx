"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import type { VideoMeta } from "@/types";
import { useFavorites } from "@/hooks/use-collection";
import { VideoCard } from "@/components/video-card";
import { getCatalog } from "@/components/paginated-grid";

export default function FavoritesPage() {
  const { ids, ready } = useFavorites();
  const [videos, setVideos] = useState<VideoMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    
    if (ids.length === 0) {
      setVideos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getCatalog()
      .then((allVideos) => {
        const idSet = new Set(ids);
        setVideos(allVideos.filter((v) => idSet.has(v.id)));
        setLoading(false);
      })
      .catch(() => {
        setVideos([]);
        setLoading(false);
      });
  }, [ids, ready]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 pb-4 sm:px-6">
      <header className="mb-12 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl gradient-brand text-white shadow-xl shadow-brand-500/30">
          <Heart size={32} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your Favorites
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted text-lg">
          Videos you've loved and saved for later.
        </p>
      </header>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="animate-spin text-brand-400" size={32} />
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {videos.map((v, i) => (
            <VideoCard key={v.id} video={v} index={i} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <Heart className="mx-auto mb-4 text-muted opacity-30" size={48} />
          <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted max-w-sm mx-auto">
            Click the heart icon on any video to save it here for quick access later.
          </p>
        </div>
      )}
    </div>
  );
}
