import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getVideosForCategory, categoryCount } from "@/lib/videos";
import { PaginatedGrid } from "@/components/paginated-grid";
import { SeoBlock } from "@/components/seo-block";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { formatCompact } from "@/lib/utils";
import { ZipDownloadButton } from "@/components/zip-download-button";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const def = getCategory(category);
  if (!def) return buildMetadata({ title: "Not found" });
  return buildMetadata({
    title: def.title,
    description: def.description,
    path: `/${def.slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const def = getCategory(category);
  if (!def) notFound();

  const isComingSoon = [
    "nature-ai-videos",
    "cinematic-ai-videos",
    "fantasy-ai-videos",
    "scifi-ai-videos",
    "anime-ai-videos",
    "ai-shorts",
  ].includes(def.slug);

  if (isComingSoon) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: def.name, url: `/${def.slug}` },
          ])}
        />

        <header className="mb-12 text-center">
          <div className="mb-4 text-6xl">{def.emoji}</div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {def.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted text-lg">
            {def.description}
          </p>
        </header>

        <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 text-center backdrop-blur-xl shadow-2xl">
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10 space-y-6">
            <span className="inline-flex items-center rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-400 border border-brand-500/20 uppercase tracking-wider">
              Rendering Queue
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Library Launching Soon
            </h2>
            <p className="text-muted text-base leading-relaxed">
              Our AI servers are currently rendering and compiling high-quality clips for this collection.
              In the meantime, explore our fully active, high-definition <strong>AI Animal Videos</strong> library containing hundreds of free wildlife downloads!
            </p>
            <div className="pt-4">
              <Link
                href="/ai-animal-videos"
                className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:opacity-95"
              >
                🦁 Explore AI Animal Videos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const all = getVideosForCategory(def);
  const initial = all.slice(0, 20);
  const count = categoryCount(def);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: def.name, url: `/${def.slug}` },
        ])}
      />

      <header className="mb-8 text-center">
        <div className="mb-3 text-5xl">{def.emoji}</div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {def.name}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted">{def.description}</p>
        
        {def.slug === "ai-animal-videos" ? (
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-brand-400">
              470+ free AI videos available
            </p>
            <p className="text-xs text-muted max-w-sm">
              Showing 100 previews below. Download the whole ZIP file to get all remaining videos instantly.
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-brand-400">
            {formatCompact(count)} free AI videos
          </p>
        )}

        {all.length > 0 && (
          <div className="mt-6 flex justify-center">
            <ZipDownloadButton categorySlug={def.slug} categoryName={def.name} />
          </div>
        )}
      </header>

      <PaginatedGrid
        initial={initial}
        initialTotal={all.length}
        query={{ category: def.slug }}
        emptyLabel="No videos in this category yet."
      />

      <div className="mt-16">
        <SeoBlock title={`About ${def.name}`}>
          <p>{def.seoContent}</p>
          <p>
            All videos in our {def.name.toLowerCase()} collection are free to
            download in HD with no watermark and no sign-up required. New AI
            generated clips are added daily.
          </p>
        </SeoBlock>
      </div>
    </div>
  );
}
