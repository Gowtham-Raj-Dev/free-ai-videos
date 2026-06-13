import { NextRequest } from "next/server";
const archiver = require("archiver");
import { PassThrough, Readable } from "node:stream";
import { getCategory } from "@/lib/categories";
import { getVideosForCategory } from "@/lib/videos";
import path from "node:path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category: categorySlug } = await params;
    const def = getCategory(categorySlug);
    
    if (!def) {
      return new Response("Category not found", { status: 404 });
    }

    const videos = getVideosForCategory(def);
    if (!videos || videos.length === 0) {
      return new Response("No videos found", { status: 404 });
    }

    // Create a PassThrough stream
    const passThrough = new PassThrough();
    
    // Convert Node.js stream to Web ReadableStream
    const stream = Readable.toWeb(passThrough) as any;

    const archive = new archiver.ZipArchive({
      zlib: { level: 0 }, // Store without compression for speed since videos are already compressed
    });

    // Pipe archiver to the PassThrough stream
    archive.pipe(passThrough);

    const PUBLIC_DIR = path.join(process.cwd(), "public");

    // Since the user requested all files from public/Ai-Animal-Videos for ai-animal-videos category
    // This bypasses the MAX_VIDEOS_LIMIT in videos.ts and downloads all 400+ files
    if (categorySlug === "ai-animal-videos") {
      const folderPath = path.join(PUBLIC_DIR, "Ai-Animal-Videos");
      // false means it won't put them inside an "Ai-Animal-Videos" root folder in the zip
      archive.directory(folderPath, false);
    } else {
      // For other categories, rely on the getVideosForCategory logic
      for (const video of videos) {
        const filePath = path.join(PUBLIC_DIR, decodeURIComponent(video.src));
        archive.file(filePath, { name: path.basename(filePath) });
      }
    }

    // Finalize the archive (this will finish the stream)
    archive.finalize();

    return new Response(stream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${def.slug}-videos.zip"`,
      },
    });
  } catch (err: any) {
    return new Response(err.stack || String(err), { status: 500 });
  }
}
