import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CategoryDef } from "@/lib/categories";
import { CategoryIcon } from "./category-icon";

export function CategoryGrid({
  categories,
}: {
  categories: (CategoryDef & { count: number })[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/${c.slug}`}
          className="group relative overflow-hidden rounded-2xl glass p-5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/15"
        >
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-500/10 blur-2xl transition group-hover:bg-brand-500/25" />
          <div className="text-3xl"><CategoryIcon name={c.icon} size={28} /></div>
          <p className="mt-3 font-semibold leading-tight">{c.name}</p>
          {c.count > 0 ? (
            <p className="mt-0.5 text-xs text-muted">{c.count} videos</p>
          ) : (
            <p className="mt-0.5 text-xs font-medium text-brand-400">
              Coming soon
            </p>
          )}
          <ArrowUpRight
            size={18}
            className="absolute right-3 top-3 text-muted opacity-0 transition group-hover:opacity-100"
          />
        </Link>
      ))}
    </div>
  );
}
