"use client";

import { useFavorites } from "@/hooks/use-collection";
import { PaginatedGrid } from "./paginated-grid";
import { Heart } from "lucide-react";

export function WishlistGrid() {
  const { ids, ready } = useFavorites();

  if (!ready) {
    return null; // wait for hydration
  }

  if (ids.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center text-muted">
        <Heart size={48} className="opacity-30" />
        <p className="text-lg">Your wishlist is empty.</p>
        <p className="text-sm">Click the heart icon on any video to save it here!</p>
      </div>
    );
  }

  return (
    <PaginatedGrid
      query={{ ids: ids.join("|") }}
      emptyLabel="No videos found in your wishlist."
    />
  );
}
