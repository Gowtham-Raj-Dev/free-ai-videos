import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { AnalyticsStore } from "@/types";
import { syncRowToSheet } from "./sheets";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "analytics.json");

let cache: AnalyticsStore | null = null;

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function load(): AnalyticsStore {
  if (cache) return cache;
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    cache = JSON.parse(raw) as AnalyticsStore;
  } catch {
    cache = {};
  }
  return cache;
}

let writeTimer: NodeJS.Timeout | null = null;
function persist() {
  ensureDir();
  // debounce disk writes to avoid hammering the FS under load
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(cache ?? {}, null, 2));
    } catch (err) {
      console.error("[store] failed to persist analytics", err);
    }
  }, 250);
}

export function getRecord(id: string) {
  const store = load();
  return store[id] ?? { views: 0, downloads: 0 };
}

export function getAllRecords(): AnalyticsStore {
  return load();
}

export function increment(
  id: string,
  field: "views" | "downloads",
  title?: string,
) {
  const store = load();
  const rec = store[id] ?? { views: 0, downloads: 0 };
  rec[field] += 1;
  store[id] = rec;
  persist();
  // fire-and-forget Google Sheets sync (no-op if not configured)
  void syncRowToSheet(id, rec, title).catch((e) =>
    console.error("[store] sheet sync failed", e),
  );
  return rec;
}
