"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, LayoutGrid, Search, User } from "lucide-react";
import { motion } from "framer-motion";
import { openSearch } from "./search-modal";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/categories", label: "Browse", icon: LayoutGrid },
  { href: "/trending-ai-videos", label: "Trending", icon: Flame },
  { href: "/", label: "Home", icon: Home },
  { href: "__search", label: "Search", icon: Search },
  { href: "/profile", label: "Library", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="bg-white dark:bg-black pb-safe rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-8px_30px_rgb(0,0,0,0.1)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.5)]">
        <div className="flex items-center justify-around py-2">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const isSearch = item.href === "__search";
            const active = !isSearch && pathname === item.href;
            const content = (
              <span className="relative flex flex-col items-center gap-0.5 px-2 py-1.5">
                {active && (
                  <motion.span
                    layoutId="bottomnav-active"
                    className="absolute -bottom-1.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-black dark:bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={21}
                  className={cn(
                    "transition-colors",
                    active ? "text-black dark:text-white" : "text-muted",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    active ? "text-black dark:text-white" : "text-muted",
                  )}
                >
                  {item.label}
                </span>
              </span>
            );
            return isSearch ? (
              <button key={item.label} onClick={openSearch} aria-label="Search">
                {content}
              </button>
            ) : (
              <Link key={item.label} href={item.href} aria-label={item.label}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
