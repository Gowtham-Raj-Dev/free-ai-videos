import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  output: "export", // Required for GitHub Pages static hosting
  basePath: isProd ? '/free-ai-videos' : '',
  assetPrefix: isProd ? '/free-ai-videos/' : '',
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
