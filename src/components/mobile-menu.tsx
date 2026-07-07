"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { CategoryIcon } from "./category-icon";
import { cn, assetPath } from "@/lib/utils";

const MAIN_LINKS = [
  { href: "/", label: "Home" },
  { href: "/videos", label: "Browse" },
  { href: "/trending-ai-videos", label: "Trending" },
  { href: "/latest-ai-videos", label: "Latest" },
  { href: "https://bundles.codelove.in/bundles", label: "Bundles" },
  { href: "https://bundles.codelove.in/profile", label: "Profile" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full glass text-muted transition hover:text-foreground"
        aria-label="Menu"
      >
        <Menu size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-app">
          <div className="flex h-14 items-center justify-between border-b border-app px-4 sm:h-16 sm:px-6">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <img src={assetPath("/favicon.ico")} alt="AIVideos Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg tracking-tight">
                AI<span className="gradient-text">Videos</span>
              </span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full glass text-muted transition hover:text-foreground"
              aria-label="Close Menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <nav className="space-y-1 pb-8">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted">Menu</p>
              {MAIN_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-medium transition",
                    pathname === l.href
                      ? "bg-brand-500/10 text-brand-400"
                      : "text-foreground hover:bg-soft"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <nav className="space-y-1 pb-6">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted">Categories</p>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {CATEGORIES.filter((c) => c.kind === "folder").map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                      pathname === `/${c.slug}`
                        ? "bg-brand-500/10 text-brand-400"
                        : "text-foreground hover:bg-soft"
                    )}
                  >
                    <span className="text-brand-400"><CategoryIcon name={c.icon} size={18} /></span>
                    {c.name}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="mt-4 border-t border-app pb-24 pt-6 text-center text-sm text-muted">
              <p>
                Built with <span className="text-red-500">❤️</span> by{" "}
                <a
                  href="https://codelove.in"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-foreground hover:text-brand-400 transition-colors"
                >
                  CodeLove.in
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
