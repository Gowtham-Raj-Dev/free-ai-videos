import type { Metadata } from "next";
import type { VideoMeta } from "@/types";
import { assetPath } from "@/lib/utils";

export const siteConfig = {
  name: "CodeLove AI Videos",
  title: "Free AI Videos by CodeLove | Best AI Video Downloader",
  description:
    "Download premium AI generated videos for free from CodeLove. Explore thousands of high-quality Free AI videos — anime, cinematic, nature, sci-fi and more. 100% Free, No watermark, created & updated daily by CodeLove.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aivideos.codelove.in",
  keywords: [
    "CodeLove",
    "codelove",
    "codelove.in",
    "CodeLove AI Videos",
    "Free AI Videos by CodeLove",
    "CodeLove Free Videos",
    "CodeLove Video Downloader",
    "Free AI Video Download",
    "Free AI Videos No Watermark",
    "AI Video Generator Alternatives",
    "Download AI Videos Free",
    "Free AI Stock Footage",
    "Best AI Videos",
    "AI Generated Videos",
    "AI Videos Free Download",
    "AI Anime Videos Free",
    "AI Shorts Videos",
    "AI Cinematic Videos",
    "Viral AI Videos",
    "Trending AI Videos",
    "AI Video Library",
    "AI Wallpaper Videos",
    "AI Background Videos",
    "AI Animation Videos",
    "free ai reels download",
    "free ai Shorts download",
    "free ai videos for youtube upload",
    "free ai videos for reels upload",
    "free ai videos for instagram upload",
    "download ai videos",
    "CodeLove assets",
    "free ai tools codelove",
    "CodeLove official ai videos",
    "Free Videos Bundle Download",
    "AI Animal Videos Bundle Download",
    "AI Miniature Reels Bundle Download",
    "AI Tech Reels Bundle Download",
    "Car Reels Bundle Download",
    "Funny Fails Clips Bundle Download",
    "Luxury Reels Bundle Download",
    "Satisfying Reels Bundle Download",
    "Study Reels Bundle Download",
    "Super Hero Videos Bundle Download",
    "Tools Tips Reels Bundle Download",
    "Emotional Videos Bundle Download",
    "Nature Videos Bundle Download",
    "Free AI Video Bundles Download"
  ],
};

export function absoluteUrl(path = "") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
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
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
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

export function softwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Free AI Video Downloader",
    operatingSystem: "Web",
    applicationCategory: "MultimediaApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: siteConfig.description,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "5430"
    }
  };
}

export function videoSchema(video: VideoMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: [absoluteUrl(assetPath(video.src))],
    uploadDate: video.uploadDate,
    contentUrl: absoluteUrl(assetPath(video.src)),
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
