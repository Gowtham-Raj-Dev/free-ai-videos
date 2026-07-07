"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Search, Sparkles, User, LogIn } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { CategoryIcon } from "./category-icon";
import { openSearch } from "./search-modal";
import { NAV_CATEGORIES } from "@/lib/categories";
import { cn, assetPath } from "@/lib/utils";

const MAIN_LINKS = [
  { href: "/", label: "Home" },
  { href: "/videos", label: "Browse" },
  { href: "/trending-ai-videos", label: "Trending" },
  { href: "/latest-ai-videos", label: "Latest" },
  { href: "https://bundles.codelove.in", label: "Bundles" },
  { href: "https://bundles.codelove.in/profile", label: "Profile" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-app transition-all duration-300",
        scrolled ? "border-b border-app" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <img src={assetPath("/favicon.ico")} alt="AIVideos Logo" className="h-8 w-8 object-contain" />
          <span className="text-lg tracking-tight">
            AI<span className="gradient-text">Videos</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {MAIN_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition",
                  active
                    ? "bg-soft text-brand-400"
                    : "text-muted hover:text-foreground hover:bg-soft",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={openSearch}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-full glass px-3 text-sm text-muted transition hover:text-foreground sm:px-4"
            aria-label="Search"
          >
            <Search size={17} />
            <span className="hidden lg:inline">Search…</span>
            <kbd className="hidden lg:flex items-center gap-0.5 rounded bg-soft px-1.5 py-0.5 text-[10px] font-sans font-medium">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </button>

          <ThemeToggle />

          <MobileMenu />
        </div>
      </div>

      {/* category chips (scrollable) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="hide-scrollbar -mt-0.5 flex gap-2 overflow-x-auto pb-2.5">
          {NAV_CATEGORIES.map((c) => {
            const href = `/${c.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={c.slug}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  active
                    ? "border-brand-400 bg-brand-500/10 text-brand-400"
                    : "border-app text-muted hover:border-brand-400/50 hover:text-foreground",
                )}
              >
                <span><CategoryIcon name={c.icon as any} size={14} /></span>
                {c.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
