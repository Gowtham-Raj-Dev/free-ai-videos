import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Eye, Download, Calendar, Clock, HardDrive, Tag } from "lucide-react";
import { getVideoById, getRelatedVideos, getAllVideos } from "@/lib/videos";
import { VideoPlayer } from "@/components/video-player";
import { VideoActions, StickyDownloadBar } from "@/components/video-actions";
import { VideoGrid } from "@/components/video-grid";
import { SectionHeading } from "@/components/section-heading";
import { JsonLd } from "@/components/json-ld";
import {
  buildMetadata,
  videoSchema,
  breadcrumbSchema,
  absoluteUrl,
} from "@/lib/seo";
import { formatCompact, formatBytes, formatDuration, formatDate, assetPath } from "@/lib/utils";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllVideos().map((v) => ({ id: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const video = getVideoById(id);
  if (!video) return buildMetadata({ title: "Video not found" });
  return buildMetadata({
    title: `${video.title} | Free AI Video Download by CodeLove (HD)`,
    description: `${video.description} Download this AI generated video for free with no watermark from CodeLove. Perfect for edits, shorts, and creators.`,
    path: `/video/${video.id}`,
    images: [absoluteUrl(assetPath(video.src))],
  });
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = getVideoById(id);
  if (!video) notFound();
  const related = getRelatedVideos(video, 10);

  const meta = [
    { icon: Eye, label: "Views", value: formatCompact(video.views) },
    { icon: Download, label: "Downloads", value: formatCompact(video.downloads) },
    { icon: Calendar, label: "Uploaded", value: formatDate(video.uploadDate) },
    { icon: Clock, label: "Duration", value: formatDuration(video.duration) },
    { icon: HardDrive, label: "Size", value: formatBytes(video.size) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <JsonLd
        data={[
          videoSchema(video),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: video.category, url: `/${video.categorySlug}` },
            { name: video.title, url: `/video/${video.id}` },
          ]),
        ]}
      />

      {/* breadcrumb */}
      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <Link href="/" className="hover:text-brand-400">Home</Link>
        <span>/</span>
        <Link href="/videos" className="hover:text-brand-400">AI Videos</Link>
        <span>/</span>
        <span className="text-foreground">{video.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <VideoPlayer id={video.id} src={video.src} title={video.title} />
        </div>

        <div className="space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-400">
              {video.category} · {video.theme}
            </span>
            <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {video.title}
            </h1>
          </div>

          <VideoActions video={video} />

          {/* stats grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {meta.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="rounded-xl glass p-3">
                  <Icon size={16} className="mb-1.5 text-brand-400" />
                  <p className="text-sm font-semibold">{m.value}</p>
                  <p className="text-[11px] text-muted">{m.label}</p>
                </div>
              );
            })}
          </div>

          {/* description */}
          <div>
            <h2 className="mb-2 text-sm font-semibold">Description</h2>
            <p className="text-sm leading-relaxed text-muted">
              {video.description}
            </p>
          </div>

          {/* tags */}
          <div>
            <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <Tag size={15} /> Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {video.tags.map((t) => (
                <Link
                  key={t}
                  href={`/videos?q=${encodeURIComponent(t)}`}
                  className="rounded-full glass px-3 py-1 text-xs capitalize text-muted transition hover:text-brand-400"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading
            eyebrow="Keep watching"
            title="Related AI Videos"
            href="/videos"
          />
          <VideoGrid videos={related} />
        </section>
      )}

    </div>
  );
}
