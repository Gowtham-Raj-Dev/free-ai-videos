#!/usr/bin/env node
// Smoke driver for free-ai-videos (Next.js app).
//
// Assumes the dev server is already running (npm run dev → :3010).
// It does NOT start the server — start it yourself first, then run this.
//
//   node .claude/skills/run-free-ai-videos/driver.mjs
//   node .claude/skills/run-free-ai-videos/driver.mjs --no-shot   # skip screenshot
//
// Env:
//   BASE_URL    default http://localhost:3010
//   CHROME_PATH override the auto-detected Chrome/Edge binary
//   SHOT        screenshot output path (default <tmp>/aivideos-home.png)
//
// Exit code 0 = every check passed. Non-zero = something is broken.

import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileP = promisify(execFile);
const BASE = process.env.BASE_URL || "http://localhost:3010";
const SHOT = process.env.SHOT || join(tmpdir(), "aivideos-home.png");
const wantShot = !process.argv.includes("--no-shot");

let failures = 0;
function ok(label) {
  console.log(`  PASS  ${label}`);
}
function bad(label, detail) {
  failures++;
  console.log(`  FAIL  ${label}\n        ${detail}`);
}
async function check(label, fn) {
  try {
    await fn();
    ok(label);
  } catch (e) {
    bad(label, e.message);
  }
}
function must(cond, msg) {
  if (!cond) throw new Error(msg);
}

// ---- Chrome/Edge auto-detection (Windows + Linux) -------------------------
function findBrowser() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  return candidates.find((p) => existsSync(p));
}

async function main() {
  console.log(`Driving ${BASE}\n`);

  // 1. Homepage renders with the key sections + the "Coming soon" categories.
  let firstId;
  await check("GET / renders home sections", async () => {
    const html = await (await fetch(BASE)).text();
    for (const marker of [
      "Latest AI Videos",
      "Trending AI Videos",
      "Popular Categories",
      "Coming soon", // theme categories show this until real content exists
    ]) {
      must(html.includes(marker), `home missing "${marker}"`);
    }
  });

  // 2. Videos API returns the catalog; grab a real id for later checks.
  await check("GET /api/videos returns items", async () => {
    const data = await (await fetch(`${BASE}/api/videos?limit=3`)).json();
    must(Array.isArray(data.items) && data.items.length > 0, "no items");
    firstId = data.items[0].id;
    must(typeof firstId === "string" && firstId.length > 0, "no id on item");
  });

  // 3. Stats API aggregates the (auto-growing, seeded) view/download counts.
  await check("GET /api/stats has non-zero totals", async () => {
    const s = await (await fetch(`${BASE}/api/stats`)).json();
    must(s.totalVideos > 0, "totalVideos is 0");
    must(s.totalViews > 0, "totalViews is 0 — seeded metrics not applied");
    must(s.totalDownloads > 0, "totalDownloads is 0");
  });

  // 4. Download route serves a real .mp4 (the fix: video/mp4 + attachment).
  await check("GET /api/download/:id serves an .mp4 attachment", async () => {
    must(firstId, "no id available");
    const res = await fetch(`${BASE}/api/download/${firstId}`);
    must(res.ok, `status ${res.status}`);
    const ct = res.headers.get("content-type") || "";
    const cd = res.headers.get("content-disposition") || "";
    must(ct.includes("video/mp4"), `content-type was "${ct}"`);
    must(/attachment/i.test(cd) && /\.mp4"/i.test(cd), `disposition was "${cd}"`);
    await res.arrayBuffer(); // drain the body
  });

  // 5. View route increments and returns ok.
  await check("POST /api/view increments", async () => {
    must(firstId, "no id available");
    const res = await fetch(`${BASE}/api/view`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: firstId }),
    });
    const j = await res.json();
    must(j.ok === true, `view returned ${JSON.stringify(j)}`);
  });

  // 6. Video detail page renders with the Download button (the only DL path).
  await check("GET /video/:id renders Download Free", async () => {
    must(firstId, "no id available");
    const html = await (await fetch(`${BASE}/video/${firstId}`)).text();
    must(html.includes("Download Free"), "detail page missing download button");
  });

  // 7. Category pages: AI Animal (real content) + a theme one (coming soon).
  await check("category pages return 200", async () => {
    for (const slug of ["ai-animal-videos", "nature-ai-videos"]) {
      const res = await fetch(`${BASE}/${slug}`);
      must(res.ok, `/${slug} → ${res.status}`);
    }
  });

  // 8. Screenshot proof via headless Chrome/Edge.
  if (wantShot) {
    await check("headless screenshot of homepage", async () => {
      const browser = findBrowser();
      must(browser, "no Chrome/Edge found — set CHROME_PATH");
      await execFileP(browser, [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1280,1700",
        // advance virtual time so framer-motion reveal animations finish
        "--virtual-time-budget=8000",
        `--screenshot=${SHOT}`,
        BASE,
      ]);
      must(existsSync(SHOT), "screenshot file not produced");
      console.log(`        → ${SHOT}`);
    });
  }

  console.log(`\n${failures === 0 ? "ALL PASS" : `${failures} FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("driver crashed:", e);
  process.exit(2);
});
