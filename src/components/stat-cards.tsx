"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Eye, Download, Flame, TrendingUp, Folder } from "lucide-react";
import type { PlatformStats } from "@/types";
import { Counter } from "./counter";
import { formatCompact, assetPath } from "@/lib/utils";

export function StatCards({ stats }: { stats: PlatformStats }) {
  const primary = [
    { label: "Total Videos", value: stats.totalVideos, icon: Film, compact: false },
    { label: "Total Views", value: stats.totalViews, icon: Eye, compact: true },
    {
      label: "Total Downloads",
      value: stats.totalDownloads,
      icon: Download,
      compact: true,
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: Folder,
      compact: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
      {primary.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass relative overflow-hidden rounded-2xl p-4 sm:p-5"
          >
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-brand-500/15 blur-2xl" />
            <Icon size={20} className="mb-3 text-brand-400" />
            <p className="text-2xl font-bold tracking-tight sm:text-3xl">
              <Counter value={s.value} compact={s.compact} />
              {s.compact && s.value >= 1000 ? "+" : ""}
            </p>
            <p className="mt-0.5 text-xs text-muted sm:text-sm">{s.label}</p>
          </motion.div>
        );
      })}

      {stats.mostViewed && (
        <SpotlightCard
          label="Most Viewed"
          icon={<Flame size={18} className="text-accent-2" />}
          id={stats.mostViewed.id}
          title={stats.mostViewed.title}
          src={stats.mostViewed.src}
          metric={`${formatCompact(stats.mostViewed.views)} views`}
        />
      )}
      {stats.mostDownloaded && (
        <SpotlightCard
          label="Most Downloaded"
          icon={<TrendingUp size={18} className="text-brand-400" />}
          id={stats.mostDownloaded.id}
          title={stats.mostDownloaded.title}
          src={stats.mostDownloaded.src}
          metric={`${formatCompact(stats.mostDownloaded.downloads)} downloads`}
        />
      )}
    </div>
  );
}

function SpotlightCard({
  label,
  icon,
  id,
  title,
  src,
  metric,
}: {
  label: string;
  icon: React.ReactNode;
  id: string;
  title: string;
  src: string;
  metric: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass flex flex-col justify-center col-span-2 overflow-hidden rounded-2xl p-3 lg:col-span-1"
    >
      <Link href={`/video/${id}`} className="flex items-center gap-3">
        <video
          src={assetPath(src)}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          className="h-16 w-12 shrink-0 rounded-lg object-cover bg-white/5"
        />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
            {icon} {label}
          </p>
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="text-xs text-brand-400">{metric}</p>
        </div>
      </Link>
    </motion.div>
  );
}
