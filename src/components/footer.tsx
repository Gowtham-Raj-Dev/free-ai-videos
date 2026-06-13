import Link from "next/link";
import { Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-app">
      <div className="mx-auto max-w-7xl px-4 py-12 pb-28 md:pb-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-white">
                <Sparkles size={16} />
              </span>
              AI<span className="gradient-text">Videos</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Download premium AI generated videos for free. HD quality, no
              watermark, updated daily.
            </p>
            <div className="mt-4">
              <p className="text-sm font-medium">Newsletter</p>
              <form className="mt-2 flex max-w-xs gap-2">
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="min-w-0 flex-1 rounded-full border border-app bg-soft px-3.5 py-2 text-sm outline-none focus:border-brand-400"
                />
                <button className="rounded-full gradient-brand px-4 py-2 text-sm font-semibold text-white">
                  Join
                </button>
              </form>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Categories</p>
            <ul className="space-y-2 text-sm text-muted">
              {CATEGORIES.filter((c) => c.kind === "theme").map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="hover:text-brand-400">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Discover</p>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/videos" className="hover:text-brand-400">Browse All</Link></li>
              <li><Link href="/trending-ai-videos" className="hover:text-brand-400">Trending</Link></li>
              <li><Link href="/latest-ai-videos" className="hover:text-brand-400">Latest</Link></li>
              <li><Link href="/popular-ai-videos" className="hover:text-brand-400">Popular</Link></li>
              <li><Link href="/categories" className="hover:text-brand-400">All Categories</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Company</p>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/about" className="hover:text-brand-400">About</Link></li>
              <li><Link href="/contact" className="hover:text-brand-400">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-brand-400">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="hover:text-brand-400">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="hover:text-brand-400">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-app pt-6 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} AIVideos. All rights reserved.</p>
          <p>Free AI Video Download · AI Generated Videos · No Watermark</p>
        </div>
      </div>
    </footer>
  );
}
