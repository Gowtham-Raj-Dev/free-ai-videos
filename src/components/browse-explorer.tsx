"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { PaginatedGrid } from "./paginated-grid";
import { CategoryIcon } from "./category-icon";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "views", label: "Most Viewed" },
  { value: "downloads", label: "Most Downloaded" },
  { value: "trending", label: "Trending" },
];

const THEME_CATS = CATEGORIES.filter((c) => c.kind === "theme");

export function BrowseExplorer() {
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [sort, setSort] = useState("latest");
  const [category, setCategory] = useState("");

  return (
    <div>
      <div className="mb-6 space-y-3">
        {/* category chips */}
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          <FilterChip
            active={category === ""}
            onClick={() => setCategory("")}
            label="All"
          />
          {THEME_CATS.map((c) => (
            <FilterChip
              key={c.slug}
              active={category === c.slug}
              onClick={() => setCategory(c.slug)}
              label={
                <span className="flex items-center gap-1.5">
                  <CategoryIcon name={c.icon} size={14} />
                  {c.name}
                </span>
              }
            />
          ))}
        </div>

        {/* sort */}
        <div className="flex items-center gap-2 text-sm text-muted">
          <SlidersHorizontal size={15} />
          <span className="mr-1">Sort:</span>
          <div className="hide-scrollbar flex gap-1.5 overflow-x-auto">
            {SORTS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSort(s.value)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition",
                  sort === s.value
                    ? "gradient-brand text-white"
                    : "glass hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <PaginatedGrid
        query={{ q: initialQ, sort, category }}
        emptyLabel={initialQ ? `No results for “${initialQ}”.` : "No videos found."}
      />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
        active
          ? "border-brand-400 bg-brand-500/10 text-brand-400"
          : "border-app text-muted hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
