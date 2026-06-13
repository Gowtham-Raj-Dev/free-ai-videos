import type { VideoMeta } from "@/types";
import { VideoCard } from "./video-card";
import { cn } from "@/lib/utils";

export function VideoGrid({
  videos,
  className,
  priorityCount = 4,
}: {
  videos: VideoMeta[];
  className?: string;
  priorityCount?: number;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {videos.map((v, i) => (
        <VideoCard key={v.id} video={v} index={i} priority={i < priorityCount} />
      ))}
    </div>
  );
}

export function VideoGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[9/16] w-full rounded-2xl skeleton" />
      ))}
    </div>
  );
}
