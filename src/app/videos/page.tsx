import { Suspense } from "react";
import type { Metadata } from "next";
import { BrowseExplorer } from "@/components/browse-explorer";
import { VideoGridSkeleton } from "@/components/video-grid";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Browse All Free AI Videos by CodeLove | 10k+ HD Clips",
  description:
    "Browse and download thousands of 100% free AI generated videos by CodeLove. Filter by category, trending, or latest. No watermark, high quality.",
  path: "/videos",
});

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Browse AI Videos
        </h1>
        <p className="mt-1 text-muted">
          Thousands of free AI generated videos · download in HD, no watermark.
        </p>
      </header>
      <Suspense fallback={<VideoGridSkeleton count={12} />}>
        <BrowseExplorer />
      </Suspense>
    </div>
  );
}
