"use client";

import { Download } from "lucide-react";

export function ZipDownloadButton({
  categorySlug,
  categoryName,
}: {
  categorySlug: string;
  categoryName: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        disabled
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 font-semibold text-muted/50 cursor-not-allowed select-none"
      >
        <Download className="w-5 h-5 text-muted/40" />
        ZIP Download (Coming Soon)
      </button>
      <p className="text-xs text-muted/60 mt-1">
        More videos coming in the future
      </p>
    </div>
  );
}

