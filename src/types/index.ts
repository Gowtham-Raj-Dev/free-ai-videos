export interface VideoMeta {
  /** Unique id derived from the file name (no extension). URL-safe. */
  id: string;
  title: string;
  /** Display category name, e.g. "AI Animal Videos" */
  category: string;
  /** URL slug for the category, e.g. "ai-animal-videos" */
  categorySlug: string;
  /** Deterministic theme overlay used for SEO category pages */
  theme: string;
  /** Public path to the mp4, URL-encoded, e.g. "/Ai-Animal-Videos/123.mp4" */
  src: string;
  /** ISO date string */
  uploadDate: string;
  /** Approx file size in bytes */
  size: number;
  /** Duration in seconds (estimated) */
  duration: number;
  width: number;
  height: number;
  tags: string[];
  description: string;
  views: number;
  downloads: number;
  /** trending score used for sorting */
  score: number;
  /** sequence index 001 to 050 */
  index: number;
}

export interface CategoryMeta {
  slug: string;
  name: string;
  /** Folder name inside /public */
  folder: string;
  title: string;
  description: string;
  seoContent: string;
  icon: string;
  count: number;
}

export interface PlatformStats {
  totalVideos: number;
  totalViews: number;
  totalDownloads: number;
  mostViewed: VideoMeta | null;
  mostDownloaded: VideoMeta | null;
  categories: number;
}

export interface AnalyticsRecord {
  views: number;
  downloads: number;
}

export type AnalyticsStore = Record<string, AnalyticsRecord>;
