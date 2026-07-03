import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { CATEGORIES } from "@/lib/categories";
import { getAllVideos } from "@/lib/videos";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url;

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1, lastModified: now },
    { url: `${base}/videos`, changeFrequency: "daily", priority: 0.9, lastModified: now },
    { url: `${base}/categories`, changeFrequency: "weekly", priority: 0.8, lastModified: now },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.4, lastModified: now },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.4, lastModified: now },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const videoPages: MetadataRoute.Sitemap = getAllVideos().map((v) => ({
    url: `${base}/video/${v.id}`,
    lastModified: v.uploadDate,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...videoPages];
}
