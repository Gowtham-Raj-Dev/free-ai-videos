---
name: run-free-ai-videos
description: Build, run, and drive the free-ai-videos Next.js app. Use when asked to start the AI videos site, run its dev server, build it, smoke-test the API/download routes, take a screenshot of the homepage, or verify the video grid / view-count / category changes.
---

free-ai-videos is a Next.js 16 (App Router, React 19) site that auto-scans
`.mp4` files under `public/` into a browsable AI-video gallery with
deterministic seeded metadata, server-rendered SEO category pages, a download
route, and local-JSON analytics. The whole app is server-driven, so the agent
handle is **HTTP**: start the dev server, then run
`.claude/skills/run-free-ai-videos/driver.mjs`, which smoke-tests every key
route and captures a homepage screenshot with headless Chrome/Edge.

All paths below are relative to the repo root (the unit).

## Prerequisites

- **Node 22** (verified on v22.15.0) and npm 11. No `apt-get` needed —
  this was developed and run on Windows 11.
- A Chromium-based browser for the screenshot step. The driver auto-detects
  Chrome and Edge at their default Windows install paths; both were present
  here. Override with `CHROME_PATH` if elsewhere, or pass `--no-shot` to skip.

## Setup

```bash
npm install
```

No env vars are required. Google Sheets sync is optional and no-ops when
unset (see `.env.example`).

## Build

```bash
npm run build
```

Prints the route table and exits 0. Routes marked `ƒ` (e.g. `/`,
`/video/[id]`, `/api/download/[id]`) are server-rendered on demand — counts
recompute every request, which is why view/download numbers tick up over time.

## Run (agent path)

The driver does **not** start the server — start it first, then drive it.

```bash
# 1. start the dev server (port 3010) in the background
npm run dev &
# 2. wait until it actually serves
timeout 60 bash -c 'until curl -sf http://localhost:3010 >/dev/null; do sleep 1; done'
# 3. run the smoke + screenshot driver
node .claude/skills/run-free-ai-videos/driver.mjs
```

Expected tail: 8 `PASS` lines then `ALL PASS`, exit 0. The driver:

| check | what it proves |
|---|---|
| `GET /` renders home sections | home shows Latest/Trending/Popular + "Coming soon" categories |
| `GET /api/videos` returns items | catalog scan works; grabs a real id for later checks |
| `GET /api/stats` non-zero totals | seeded auto-growing view/download metrics are applied |
| `GET /api/download/:id` `.mp4` attachment | download serves `content-type: video/mp4` + `attachment; filename="….mp4"` |
| `POST /api/view` increments | analytics write path works |
| `GET /video/:id` renders Download Free | detail page (the only download entry point) renders |
| category pages return 200 | `ai-animal-videos` (real content) + `nature-ai-videos` (coming soon) |
| headless screenshot | proves the page paints |

Screenshot → `%TEMP%\aivideos-home.png` (override with `SHOT=`). **Open it** —
it should show the hero with floating frame-thumbnails, the stat cards, the
trending carousel, and the Popular Categories row. Flags: `--no-shot` skips
the screenshot; `BASE_URL=` points at a different origin.

### Just the screenshot (no driver)

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new \
  --disable-gpu --hide-scrollbars --window-size=1280,1700 \
  --virtual-time-budget=8000 \
  --screenshot="C:\Users\gowth\AppData\Local\Temp\aivideos-home.png" \
  "http://localhost:3010"
```

## Run (human path)

```bash
npm run dev   # → serves http://localhost:3010, hot-reloads. Ctrl-C to stop.
```

A browser at that URL shows the full UI. Useless headless — use the driver.

## Gotchas

- **`--virtual-time-budget` is mandatory for the screenshot.** The homepage
  reveals most content via framer-motion `whileInView` animations. A plain
  `chrome --screenshot` captures before they fire — you get the navbar over a
  near-black page (≈220 KB file). `--virtual-time-budget=8000` advances time
  so the reveals complete (≈760 KB file with real content).
- **Grid card thumbnails are video frames, not images.** There are no
  thumbnail image files — `VideoCard` mounts the `.mp4` with a `#t=0.5` media
  fragment as a static poster, lazy-loaded ~300px before the viewport. In a
  headless single-shot, off-screen carousel cards may still show their gradient
  placeholder; that's expected, not a bug.
- **Port is 3010, not 3000.** `npm run dev` uses `-p 3010`; the driver defaults
  to `http://localhost:3010`. `npm start` (`next start`) would use 3000 — pass
  `BASE_URL=http://localhost:3000` to the driver if you run the prod server.
- **Theme categories are intentionally empty.** `getVideosForCategory` /
  `categoryCount` hard-return empty for the six theme slugs (nature, cinematic,
  fantasy, scifi, anime, ai-shorts) so they render "Coming soon". Real content
  lives under `ai-animal-videos` (kind `all`). The driver asserts both.

## Troubleshooting

- **`EADDRINUSE: :::3010`**: a dev server is already running on 3010 — reuse it
  (skip step 1) or `pkill -f "next dev"` first.
- **`no Chrome/Edge found — set CHROME_PATH`**: the driver's default install
  paths didn't match. Set `CHROME_PATH=/path/to/chrome` or run with `--no-shot`.
- **All HTTP checks fail / connection refused**: the server isn't up yet. Run
  the `timeout … until curl` poll before the driver instead of a fixed sleep.
