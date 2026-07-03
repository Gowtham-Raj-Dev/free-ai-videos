import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  output: "export", // Required for GitHub Pages static hosting
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/free-ai-videos",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "/free-ai-videos",
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  /* 
  // Next.js static export does not support custom headers()
  async headers() {
    return [
      {
        // long-cache the static mp4 assets served from /public
        source: "/:folder(Ai-[^/]+)/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  */
};

export default nextConfig;
