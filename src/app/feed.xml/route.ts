import { getLatest } from "@/lib/videos";
import { siteConfig, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const items = getLatest(40);
  const body = items
    .map(
      (v) => `    <item>
      <title>${escape(v.title)}</title>
      <link>${absoluteUrl(`/video/${v.id}`)}</link>
      <guid>${absoluteUrl(`/video/${v.id}`)}</guid>
      <description>${escape(v.description)}</description>
      <pubDate>${new Date(v.uploadDate).toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(siteConfig.name)} — Latest AI Videos</title>
    <link>${siteConfig.url}</link>
    <description>${escape(siteConfig.description)}</description>
    <language>en</language>
${body}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
