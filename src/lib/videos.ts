import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { PlatformStats, VideoMeta } from "@/types";
import { THEMES, type Theme, CATEGORIES, type CategoryDef } from "./categories";
import { hashString, seededRandom, slugify } from "./utils";
import { generateDescription, generateTags, generateTitle } from "./titles";
import { getAllRecords } from "./store";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);
// folders inside /public that are NOT video libraries
const IGNORE = new Set(["thumbnails", "icons", "_next"]);

function prettyCategory(folder: string): string {
  return folder
    .replace(/[-_]+/g, " ")
    .replace(/\bai\b/gi, "AI")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/Ai/g, "AI");
}

interface RawFile {
  folder: string;
  baseFolder: string;
  file: string;
  size: number;
  index: number;
}

// Adjust MAX_VIDEOS_PER_FOLDER to control how many videos are scanned from each folder
// Set to null to load all videos fully
export const MAX_VIDEOS_PER_FOLDER: number | null = 50;

let scanned: RawFile[] | null = null;

function scanFiles(): RawFile[] {
  if (scanned) return scanned;
  const out: RawFile[] = [];
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true });
  } catch {
    return [];
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (IGNORE.has(entry.name) || entry.name.startsWith(".")) continue;
    const baseDir = path.join(PUBLIC_DIR, entry.name);
    
    let subDirs = [""];
    if (entry.name === "Funny-Fails-Clips") {
      subDirs = ["Funny Fails Clips [001 - 100]"];
    }

    let folderVideoCount = 0;
    for (const sub of subDirs) {
      const dirToScan = path.join(baseDir, sub);
      const folderPath = sub ? `${entry.name}/${sub}` : entry.name;
      
      let files: string[] = [];
      try {
        files = fs.readdirSync(dirToScan);
      } catch {
        continue;
      }

      for (const f of files) {
        if (!VIDEO_EXT.has(path.extname(f).toLowerCase())) continue;
        
        const isStudyReels = entry.name === "Study-Reels";
        if (!isStudyReels && MAX_VIDEOS_PER_FOLDER !== null && MAX_VIDEOS_PER_FOLDER > 0 && folderVideoCount >= MAX_VIDEOS_PER_FOLDER) {
          break;
        }
        
        let size = 0;
        try {
          size = fs.statSync(path.join(dirToScan, f)).size;
        } catch {
          /* ignore */
        }
        out.push({ folder: folderPath, baseFolder: entry.name, file: f, size, index: folderVideoCount + 1 });
        folderVideoCount++;
      }
    }
  }
  scanned = out;
  return out;
}

function buildMeta(raw: RawFile): VideoMeta {
  const id = raw.file.replace(/\.[^.]+$/, "");
  const seed = hashString(id);
  const theme: Theme = THEMES[seed % THEMES.length];
  const category = prettyCategory(raw.baseFolder);
  const categorySlug = slugify(category);
  
  let baseTitle = category;
  if (baseTitle.toLowerCase().endsWith('s')) {
    baseTitle = baseTitle.slice(0, -1);
  }
  const title = `${baseTitle} ${raw.index.toString().padStart(3, "0")}`;

  // base metrics are computed live in getAllVideos() so they grow over time
  const baseViews = 0;
  const baseDownloads = 0;
  const uploadDate = new Date(
    Date.now() - (raw.index * 86_400_000)
  ).toISOString();
  const duration = 6 + Math.floor(seededRandom(seed + 21) * 13);

  const encodedPath = raw.folder.split("/").map((p) => encodeURIComponent(p)).join("/");

  return {
    id,
    title,
    category,
    categorySlug,
    theme,
    src: `/${encodedPath}/${encodeURIComponent(raw.file)}`,
    uploadDate,
    size: raw.size,
    duration,
    width: 1080,
    height: 1920,
    tags: generateTags(seed, theme),
    description: generateDescription(title, theme, category),
    views: baseViews,
    downloads: baseDownloads,
    score: 0,
    index: raw.index,
  };
}

/**
 * Deterministic "organic" view/download counts that grow with real elapsed
 * time. Each video gets a stable seeded baseline plus a steady per-day rate, so
 * numbers tick up slowly on every (force-dynamic) request without any cron job.
 */
function dummyMetrics(v: VideoMeta): {
  views: number;
  downloads: number;
} {
  const seed = hashString(v.id);

  // Give 001 the highest views, grading down cleanly
  const views = Math.max(100, 50000 - (v.index * 800) + Math.floor(seededRandom(seed + 3) * 100));
  
  // downloads run at 3–8% of views, plus a small seeded base
  const dlRate = 0.03 + seededRandom(seed + 9) * 0.05;
  const downloads =
    Math.floor(views * dlRate) + Math.floor(seededRandom(seed + 11) * 20);

  return { views, downloads };
}

let catalog: VideoMeta[] | null = null;

function baseCatalog(): VideoMeta[] {
  if (catalog) return catalog;
  let all = scanFiles().map(buildMeta);
  all.sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));
  
  catalog = all;
  return catalog;
}

/** Returns the full catalog with live view/download counts merged in. */
export function getAllVideos(): VideoMeta[] {
  const records = getAllRecords();
  return baseCatalog().map((v) => {
    const rec = records[v.id];
    const dummy = dummyMetrics(v);
    const views = dummy.views + (rec?.views ?? 0);
    const downloads = dummy.downloads + (rec?.downloads ?? 0);
    const recency = Math.max(
      0,
      1 - (Date.now() - new Date(v.uploadDate).getTime()) / (120 * 86_400_000),
    );
    const score = views * 0.5 + downloads * 2 + recency * 40000;
    return { ...v, views, downloads, score };
  });
}

export function getVideoById(id: string): VideoMeta | undefined {
  return getAllVideos().find((v) => v.id === id);
}

export function getRelatedVideos(video: VideoMeta, limit = 8): VideoMeta[] {
  return getAllVideos()
    .filter((v) => v.id !== video.id)
    .sort((a, b) => {
      const aMatch = a.theme === video.theme ? 0 : 1;
      const bMatch = b.theme === video.theme ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      return b.score - a.score;
    })
    .slice(0, limit);
}

export function getVideosForCategory(def: CategoryDef): VideoMeta[] {
  const all = getAllVideos();
  if (def.kind === "folder") {
    return all
      .filter((v) => v.categorySlug === def.slug)
      .sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
  }
  if (def.kind === "theme") {
    return all
      .filter((v) => v.theme === def.theme)
      .sort((a, b) => b.score - a.score);
  }
  if (def.kind === "sort") {
    const sorted = [...all];
    switch (def.sort) {
      case "latest":
        sorted.sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));
        break;
      case "popular":
        sorted.sort((a, b) => b.views - a.views);
        break;
      case "downloads":
        sorted.sort((a, b) => b.downloads - a.downloads);
        break;
      default:
        sorted.sort((a, b) => b.score - a.score);
    }
    return sorted;
  }
  return all;
}

export function categoryCount(def: CategoryDef): number {
  if (def.kind === "folder") {
    return baseCatalog().filter((v) => v.categorySlug === def.slug).length;
  }
  if (def.kind === "theme")
    return baseCatalog().filter((v) => v.theme === def.theme).length;
  return baseCatalog().length;
}

export function getTrending(limit = 12): VideoMeta[] {
  return [...getAllVideos()].sort((a, b) => b.score - a.score).slice(0, limit);
}

export function getLatest(limit = 12): VideoMeta[] {
  return [...getAllVideos()]
    .sort((a, b) => b.uploadDate.localeCompare(a.uploadDate))
    .slice(0, limit);
}

export function getMostViewed(limit = 12): VideoMeta[] {
  return [...getAllVideos()].sort((a, b) => b.views - a.views).slice(0, limit);
}

export function getMostDownloaded(limit = 12): VideoMeta[] {
  return [...getAllVideos()]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, limit);
}

export function getStats(): PlatformStats {
  const all = getAllVideos();
  const totalViews = all.reduce((s, v) => s + v.views, 0);
  const totalDownloads = all.reduce((s, v) => s + v.downloads, 0);
  const mostViewed =
    all.length > 0
      ? all.reduce((m, v) => (v.views > m.views ? v : m), all[0])
      : null;
  const mostDownloaded =
    all.length > 0
      ? all.reduce((m, v) => (v.downloads > m.downloads ? v : m), all[0])
      : null;
  const cats = new Set(all.map((v) => v.categorySlug));
  return {
    totalVideos: all.length,
    totalViews,
    totalDownloads,
    mostViewed,
    mostDownloaded,
    categories: cats.size,
  };
}

export function searchVideos(query: string, limit = 60): VideoMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllVideos()
    .map((v) => {
      const hay = `${v.title} ${v.category} ${v.theme} ${v.tags.join(" ")}`.toLowerCase();
      let s = 0;
      if (v.title.toLowerCase().includes(q)) s += 10;
      if (hay.includes(q)) s += 5;
      for (const word of q.split(/\s+/)) if (hay.includes(word)) s += 1;
      return { v, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.v.score - a.v.score)
    .slice(0, limit)
    .map((x) => x.v);
}

export function getCategorySummaries() {
  return CATEGORIES.map((def) => ({
    ...def,
    count: categoryCount(def),
  }));
}
