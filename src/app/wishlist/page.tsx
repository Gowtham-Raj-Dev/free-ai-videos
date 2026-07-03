import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { WishlistGrid } from "@/components/wishlist-grid";

export const metadata = buildMetadata({
  title: "Your Wishlist | Free AI Videos by CodeLove",
  description: "View and manage your favorite free AI generated videos by CodeLove.",
});

export default function WishlistPage() {
  return (
    <main className="min-h-screen pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-10 text-center sm:mb-14">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Your <span className="gradient-text">Wishlist</span>
          </h1>
          <p className="mt-4 text-base text-muted sm:text-lg">
            All your favorite AI videos saved locally in your browser.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[9/16] animate-pulse rounded-2xl bg-app/50"
                />
              ))}
            </div>
          }
        >
          <WishlistGrid />
        </Suspense>
      </div>
    </main>
  );
}
