import type { CategoryMeta } from "@/types";

/** Theme keys used to overlay SEO categories on the physical library. */
export const THEMES = [
  "nature",
  "cinematic",
  "fantasy",
  "scifi",
  "anime",
  "shorts",
] as const;

export type Theme = (typeof THEMES)[number];

export interface CategoryDef {
  slug: string;
  name: string;
  emoji: string;
  title: string;
  description: string;
  seoContent: string;
  /** how videos are selected for this page */
  kind: "all" | "theme" | "sort";
  theme?: Theme;
  sort?: "trending" | "latest" | "popular" | "downloads";
}

/**
 * SEO landing categories. These power /[category] routes, the nav,
 * and the homepage sections. Themed ones filter the library by an
 * assigned theme so every page has real content.
 */
export const CATEGORIES: CategoryDef[] = [
  {
    slug: "free-ai-videos",
    name: "Free AI Videos",
    emoji: "✨",
    kind: "all",
    title: "Free AI Video Download — HD AI Generated Videos",
    description:
      "Download premium AI generated videos for free. No watermark, no sign-up. Thousands of high-quality AI clips updated daily.",
    seoContent:
      "Explore our complete library of free AI generated videos. Every clip is rendered in high definition and free to download with no watermark and no account required. From hyper-real wildlife to cinematic dreamscapes, our AI video gallery is updated daily with fresh content for creators, editors and storytellers.",
  },
  {
    slug: "trending-ai-videos",
    name: "Trending AI Videos",
    emoji: "🔥",
    kind: "sort",
    sort: "trending",
    title: "Trending AI Videos — Most Popular AI Clips Right Now",
    description:
      "See the trending AI videos everyone is downloading right now. The hottest AI generated clips, ranked by views and downloads.",
    seoContent:
      "These are the trending AI videos with the most momentum right now, ranked by a blend of views and downloads. Discover what other creators are downloading and find viral-ready AI clips for your next project.",
  },
  {
    slug: "latest-ai-videos",
    name: "Latest AI Videos",
    emoji: "🆕",
    kind: "sort",
    sort: "latest",
    title: "Latest AI Videos — New AI Generated Clips Added Daily",
    description:
      "Browse the latest AI generated videos added to our library. Fresh AI clips uploaded daily, free to download in HD.",
    seoContent:
      "Stay ahead with the latest AI videos added to our gallery. We publish new AI generated clips every day so you always have fresh, on-trend footage to download for free.",
  },
  {
    slug: "popular-ai-videos",
    name: "Popular AI Videos",
    emoji: "⭐",
    kind: "sort",
    sort: "popular",
    title: "Popular AI Videos — Most Viewed AI Generated Videos",
    description:
      "The most popular AI videos of all time, ranked by total views. Download the AI clips loved by thousands of creators.",
    seoContent:
      "Our most popular AI videos of all time, ranked by total views. These crowd favorites have been watched and downloaded thousands of times — a curated shortcut to the best AI generated content in the library.",
  },
  {
    slug: "ai-animal-videos",
    name: "AI Animal Videos",
    emoji: "🦁",
    kind: "all",
    title: "AI Animal Videos — Free AI Generated Wildlife & Animals",
    description:
      "Download high-quality AI generated animal videos for free. High definition wildlife clips, lions, tigers, eagles, and more.",
    seoContent:
      "Explore our exclusive collection of AI animal videos. Featuring stunning AI-generated wildlife, pets, and fantasy creatures, all clips are free to download in high definition with no watermarks.",
  },
  {
    slug: "nature-ai-videos",
    name: "Nature AI Videos",
    emoji: "🌿",
    kind: "theme",
    theme: "nature",
    title: "Nature AI Videos — AI Generated Wildlife & Landscapes",
    description:
      "Download stunning nature AI videos free. AI generated wildlife, landscapes and natural wonders in cinematic HD.",
    seoContent:
      "Immerse yourself in nature AI videos — AI generated wildlife, sweeping landscapes and breathtaking natural moments. Perfect background footage for documentaries, ambient screens and nature-inspired content, free to download in HD.",
  },
  {
    slug: "cinematic-ai-videos",
    name: "Cinematic AI Videos",
    emoji: "🎬",
    kind: "theme",
    theme: "cinematic",
    title: "Cinematic AI Videos — Film-Grade AI Generated Clips",
    description:
      "Download cinematic AI videos free. Film-grade AI generated footage with dramatic lighting and depth, in HD.",
    seoContent:
      "Cinematic AI videos engineered for impact — dramatic lighting, shallow depth of field and film-grade color. Drop these AI generated clips into trailers, intros and reels to give any project a blockbuster feel.",
  },
  {
    slug: "fantasy-ai-videos",
    name: "Fantasy AI Videos",
    emoji: "🐉",
    kind: "theme",
    theme: "fantasy",
    title: "Fantasy AI Videos — Magical AI Generated Worlds",
    description:
      "Download fantasy AI videos free. Magical creatures, mythical worlds and surreal AI generated scenes in HD.",
    seoContent:
      "Step into fantasy AI videos full of mythical creatures, enchanted worlds and surreal imagination. These AI generated clips are ideal for gaming content, storytelling and anything that needs a touch of magic.",
  },
  {
    slug: "scifi-ai-videos",
    name: "Sci-Fi AI Videos",
    emoji: "🚀",
    kind: "theme",
    theme: "scifi",
    title: "Sci-Fi AI Videos — Futuristic AI Generated Footage",
    description:
      "Download sci-fi AI videos free. Futuristic worlds, neon cities and otherworldly AI generated scenes in HD.",
    seoContent:
      "Futuristic sci-fi AI videos packed with neon cities, alien worlds and next-gen visuals. Use these AI generated clips for tech intros, music videos and anything that should feel like the future.",
  },
  {
    slug: "anime-ai-videos",
    name: "Anime AI Videos",
    emoji: "🎴",
    kind: "theme",
    theme: "anime",
    title: "Anime AI Videos — Stylized AI Generated Animation",
    description:
      "Download anime AI videos free. Stylized, vibrant AI generated animation clips in HD, no watermark.",
    seoContent:
      "Vibrant anime AI videos with bold, stylized animation and expressive color. These AI generated clips are perfect for edits, AMVs and stylish social content — free to download with no watermark.",
  },
  {
    slug: "ai-shorts",
    name: "AI Shorts",
    emoji: "📱",
    kind: "theme",
    theme: "shorts",
    title: "AI Shorts — Vertical AI Videos for Reels & Shorts",
    description:
      "Download AI shorts free. Snappy vertical AI generated videos made for Reels, Shorts and TikTok in HD.",
    seoContent:
      "Snappy AI shorts built for vertical feeds — Reels, YouTube Shorts and TikTok. These bite-sized AI generated clips are optimized for mobile, loop beautifully and are free to download in HD.",
  },
];

export const CATEGORY_MAP: Record<string, CategoryDef> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);

/** Categories shown in the main navigation / chips. */
export const NAV_CATEGORIES = CATEGORIES.filter(
  (c) =>
    c.slug === "trending-ai-videos" ||
    c.slug === "ai-animal-videos" ||
    (c.kind === "theme" && c.slug !== "ai-shorts") ||
    c.slug === "ai-shorts",
);

export function getCategory(slug: string): CategoryDef | undefined {
  return CATEGORY_MAP[slug];
}

export function toCategoryMeta(def: CategoryDef, count: number): CategoryMeta {
  return {
    slug: def.slug,
    name: def.name,
    folder: def.theme ?? def.slug,
    title: def.title,
    description: def.description,
    seoContent: def.seoContent,
    emoji: def.emoji,
    count,
  };
}
