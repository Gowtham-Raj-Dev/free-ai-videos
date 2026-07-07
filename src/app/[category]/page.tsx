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
import { CategoryIcon } from "@/components/category-icon";

export const dynamic = "force-static";

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
    title: `${def.title} | Free by CodeLove`,
    description: `${def.description} Download high-quality free AI generated videos by CodeLove. No watermark, HD clips.`,
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

      <header className="mb-8 text-center flex flex-col items-center">
        <div className="mb-3 text-brand-400"><CategoryIcon name={def.icon} size={48} /></div>
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
              Showing 100 previews below.
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-brand-400">
            {formatCompact(count)} free AI videos
          </p>
        )}

        {all.length > 0 && def.kind === "folder" && (
          <div className="mt-6 flex justify-center">
            <ZipDownloadButton categorySlug={def.slug} categoryName={def.name} />
          </div>
        )}
      </header>

      <PaginatedGrid
        initial={initial}
        initialTotal={all.length}
        query={{ 
          category: def.slug,
          kind: def.kind,
          theme: def.theme,
          categorySort: def.sort,
        }}
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
