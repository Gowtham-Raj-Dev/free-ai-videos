import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Download, Zap, ShieldCheck, RefreshCw, Smartphone } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About AIVideos | 100% Free AI Generated Videos",
  description:
    "Learn about AIVideos — the premier platform for downloading free AI generated videos in 4K & HD with no watermark. AI video stock footage for everyone.",
  path: "/about",
});

const FEATURES = [
  { icon: Download, title: "Free Forever", text: "Every AI video is free to download in HD — no paywalls, no watermark." },
  { icon: Zap, title: "Blazing Fast", text: "Optimized, mobile-first delivery with lazy loading and instant previews." },
  { icon: RefreshCw, title: "Updated Daily", text: "New AI generated videos are added to the library every single day." },
  { icon: ShieldCheck, title: "No Sign-up", text: "Download instantly — no account, no email, no friction." },
  { icon: Smartphone, title: "Mobile First", text: "Designed primarily for smartphones with a touch-friendly experience." },
  { icon: Sparkles, title: "Premium Quality", text: "Curated, high-quality AI clips across every popular theme." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="grid mx-auto h-14 w-14 place-items-center rounded-2xl gradient-brand text-white shadow-lg shadow-brand-500/30">
          <Sparkles size={26} />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
          About <span className="gradient-text">AIVideos</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          AIVideos is a premium platform for discovering and downloading
          AI generated videos — completely free. Our mission is to make
          world-class AI video content accessible to every creator, editor and
          storyteller on the planet.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="rounded-2xl glass p-5">
              <Icon size={22} className="mb-3 text-brand-400" />
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.text}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-3xl glass p-8 text-center">
        <h2 className="text-xl font-bold">Ready to explore?</h2>
        <p className="mt-2 text-muted">
          Thousands of free AI videos are waiting for you.
        </p>
        <Link
          href="/videos"
          className="mt-5 inline-flex rounded-full gradient-brand px-7 py-3 font-semibold text-white"
        >
          Browse AI Videos
        </Link>
      </div>
    </div>
  );
}
