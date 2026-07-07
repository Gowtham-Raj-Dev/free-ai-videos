"use client";

import { useEffect, useRef } from "react";
import { useRecent } from "@/hooks/use-collection";
import { assetPath } from "@/lib/utils";

export function VideoPlayer({
  id,
  src,
  poster,
  title,
}: {
  id: string;
  src: string;
  poster?: string;
  title: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const { push } = useRecent();
  const tracked = useRef(false);

  useEffect(() => {
    // record a view once per mount, and add to recently viewed
    if (tracked.current) return;
    tracked.current = true;
    push(id);
    const sent = sessionStorage.getItem(`viewed-${id}`);
    if (!sent) {
      sessionStorage.setItem(`viewed-${id}`, "1");
      fetch(assetPath("/api/view"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        keepalive: true,
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="relative overflow-hidden rounded-3xl glass">
      <video
        ref={ref}
        src={poster ? assetPath(src) : `${assetPath(src)}#t=0.5`}
        poster={poster}
        // show a real frame on mobile (which won't paint one from preload)
        onLoadedMetadata={(e) => {
          if (!poster && e.currentTarget.currentTime < 0.4) {
            try {
              e.currentTarget.currentTime = 0.5;
            } catch {
              /* ignore */
            }
          }
        }}
        controls
        // hide the native 3-dot "Download" so there is one canonical download
        // path (the Download Free button → /api/download/<id>.mp4)
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        loop
        playsInline
        preload="metadata"
        aria-label={title}
        className="mx-auto max-h-[72vh] w-full bg-black object-contain"
      />
    </div>
  );
}
