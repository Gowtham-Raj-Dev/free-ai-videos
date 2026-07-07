"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { assetPath } from "@/lib/utils";

function PageLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or search params change, complete the loading progress and close it
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 100); // reduced from 300 to close faster
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Safety fallback: never hang for more than 4 seconds
  useEffect(() => {
    if (loading) {
      const fallback = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 4000);
      return () => clearTimeout(fallback);
    }
  }, [loading]);

  // Simulate progress bar movement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && progress < 90) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          // Increment slowly as it gets closer to 90
          const diff = (90 - prev) * 0.15;
          return prev + Math.max(diff, 1);
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, progress]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external links
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//")
      ) {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
      }

      // Ignore hash links / same page anchors
      if (href.startsWith("#") || href.includes("#")) {
        const url = new URL(href, window.location.href);
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        ) {
          return;
        }
      }

      // Ignore target="_blank"
      if (anchor.getAttribute("target") === "_blank") return;

      // Ignore download links
      if (anchor.hasAttribute("download")) return;

      // Ignore media/document extensions
      const pathOnly = href.split("?")[0].split("#")[0];
      if (
        /\.(pdf|zip|mp4|webm|jpg|jpeg|png|gif|svg|csv|xlsx)$/i.test(pathOnly)
      ) {
        return;
      }

      // Ignore click with modifier keys (Cmd/Ctrl/Shift/Alt or middle click)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      // If we are already on this path with same search params, don't show loading
      const targetUrl = new URL(href, window.location.href);
      if (
        targetUrl.pathname === window.location.pathname &&
        targetUrl.search === window.location.search
      ) {
        return;
      }

      // Trigger loader
      setLoading(true);
      setProgress(10);
    };

    const handlePopState = () => {
      setLoading(true);
      setProgress(10);
    };

    document.addEventListener("click", handleLinkClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleLinkClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <>
          {/* Top Progress Bar */}
          <motion.div
            initial={{ width: "0%", opacity: 1 }}
            animate={{ width: `${progress}%`, opacity: 1 }}
            exit={{ width: "100%", opacity: 0 }}
            transition={{
              width: { type: "tween", ease: "easeOut", duration: 0.2 },
              opacity: { duration: 0.3, delay: 0.1 },
            }}
            className="fixed top-0 left-0 z-50 h-[3px] gradient-brand shadow-[0_0_8px_var(--color-brand-400)] pointer-events-none"
          />

          {/* Glassmorphism Loader Overlay (fades in slightly later to avoid flickering on fast pages) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md pointer-events-auto"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                <span className="text-sm font-semibold tracking-wide text-foreground/80">
                  Loading AI Video Library...
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function PageLoader() {
  return (
    <Suspense fallback={null}>
      <PageLoaderInner />
    </Suspense>
  );
}
