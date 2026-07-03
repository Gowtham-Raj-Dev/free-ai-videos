import type { Metadata } from "next";
import { CategoryGrid } from "@/components/category-grid";
import { getCategorySummaries } from "@/lib/videos";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "Browse All Free AI Video Categories | CodeLove (No Watermark)",
  description:
    "Explore our complete directory of free AI video categories from CodeLove — anime, cinematic, nature, sci-fi, fantasy, shorts and more. Download AI generated videos in HD.",
  path: "/categories",
});

export default function CategoriesPage() {
  const categories = getCategorySummaries();
  const themes = categories.filter((c) => c.kind === "folder");
  const collections = categories.filter((c) => c.kind !== "folder");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Explore Categories
        </h1>
        <p className="mt-2 text-muted">
          Find the perfect AI video for any project — sorted by theme.
        </p>
      </header>

      <h2 className="mb-4 text-lg font-bold">Library Folders</h2>
      <CategoryGrid categories={themes} />

      <h2 className="mb-4 mt-12 text-lg font-bold">Collections</h2>
      <CategoryGrid categories={collections} />
    </div>
  );
}
