"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCompact } from "@/lib/utils";

export interface DailyPoint {
  day: string;
  views: number;
  downloads: number;
}

export interface TopPoint {
  name: string;
  value: number;
}

const tooltipStyle = {
  background: "rgba(20,20,24,0.9)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#fff",
  fontSize: 12,
};

export function TrendChart({ data }: { data: DailyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ec4899" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "currentColor" }} />
        <YAxis
          tick={{ fontSize: 11, fill: "currentColor" }}
          tickFormatter={(v) => formatCompact(v)}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => formatCompact(Number(value))}
        />
        <Area
          type="monotone"
          dataKey="views"
          stroke="#6366f1"
          fill="url(#gv)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="downloads"
          stroke="#ec4899"
          fill="url(#gd)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TopBarChart({ data }: { data: TopPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(260, data.length * 34)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={140}
          tick={{ fontSize: 11, fill: "currentColor" }}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => formatCompact(Number(value))}
          cursor={{ fill: "rgba(128,128,128,0.1)" }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
