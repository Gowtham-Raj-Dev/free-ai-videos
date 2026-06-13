import type { Metadata } from "next";
import type { VideoMeta } from "@/types";

export const siteConfig = {
  name: "AIVideos",
  title: "Free AI Video Download — AI Generated Videos in HD",
  description:
    "Download premium AI generated videos for free. Explore thousands of high-quality AI videos — anime, cinematic, nature, sci-fi and more. No watermark, updated daily.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ai-video-download.vercel.app",
  keywords: [
    "Free AI Video Download",
    "AI Video Download",
    "Download AI Videos",
    "Free AI Videos",
    "AI Generated Videos",
    "AI Videos Free Download",
    "AI Anime Videos",
    "AI Shorts Videos",
    "AI Cinematic Videos",
    "AI Video Gallery",
    "Trending AI Videos",
    "AI Video Library",
    "AI Wallpaper Videos",
    "AI Background Videos",
    "AI Animation Videos",
  ],
};

export function absoluteUrl(path = "") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  images,
}: {
  title?: string;
  description?: string;
  path?: string;
  images?: string[];
}): Metadata {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.title;
  const desc = description || siteConfig.description;
  const url = absoluteUrl(path);
  return {
    title: fullTitle,
    description: desc,
    keywords: siteConfig.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description: desc,
      siteName: siteConfig.name,
      images: images?.map((i) => ({ url: i })) ?? [absoluteUrl("/opengraph-image")],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: images ?? [absoluteUrl("/opengraph-image")],
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.svg"),
    description: siteConfig.description,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/videos?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function videoSchema(video: VideoMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: [absoluteUrl(video.src)],
    uploadDate: video.uploadDate,
    contentUrl: absoluteUrl(video.src),
    embedUrl: absoluteUrl(`/video/${video.id}`),
    duration: `PT${video.duration}S`,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/WatchAction",
        userInteractionCount: video.views,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/DownloadAction",
        userInteractionCount: video.downloads,
      },
    ],
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
