import { Hero } from "@/components/hero";
import { StatCards } from "@/components/stat-cards";
import { Carousel } from "@/components/carousel";
import { VideoGrid } from "@/components/video-grid";
import { SectionHeading } from "@/components/section-heading";
import { CategoryGrid } from "@/components/category-grid";
import { SeoBlock } from "@/components/seo-block";
import { Reveal } from "@/components/motion";
import { JsonLd } from "@/components/json-ld";
import {
  getTrending,
  getLatest,
  getMostViewed,
  getMostDownloaded,
  getStats,
  getVideosForCategory,
  getCategorySummaries,
} from "@/lib/videos";
import { getCategory } from "@/lib/categories";
import { faqSchema, websiteSchema, softwareSchema } from "@/lib/seo";

export const dynamic = "force-static";

const HOME_FAQS = [
  {
    q: "Are these AI videos really free to download?",
    a: "Yes. Every AI generated video on AIVideos by CodeLove is 100% free to download in HD with no watermark and no sign-up required.",
  },
  {
    q: "What kinds of free AI videos can I download?",
    a: "We offer free AI generated videos across many themes including anime, cinematic, nature, sci-fi, fantasy and vertical AI shorts — updated daily by CodeLove.",
  },
  {
    q: "Can I use these free AI videos for my own projects?",
    a: "Yes, our free AI video clips are perfect for reels, edits, backgrounds, and creative projects on any platform.",
  },
];

export default function HomePage() {
  const stats = getStats();
  const trending = getTrending(12);
  const latest = getLatest(10);
  const popular = getMostViewed(12);
  const mostDownloaded = getMostDownloaded(12);
  const categories = getCategorySummaries();

  const anime = getCategory("anime-ai-videos");
  const cinematic = getCategory("cinematic-ai-videos");
  const nature = getCategory("nature-ai-videos");

  const animeVids = anime ? getVideosForCategory(anime).slice(0, 12) : [];
  const cinematicVids = cinematic
    ? getVideosForCategory(cinematic).slice(0, 12)
    : [];
  const natureVids = nature ? getVideosForCategory(nature).slice(0, 12) : [];

  return (
    <div className="space-y-16 sm:space-y-20">
      <JsonLd data={[websiteSchema(), softwareSchema(), faqSchema(HOME_FAQS)]} />

      <Hero
        floats={[...trending].sort(() => Math.random() - 0.5).slice(0, 5)}
        totalVideos={stats.totalVideos}
        totalDownloads={stats.totalDownloads}
      />

      {/* stats */}
      <section className="-mt-8 mx-auto max-w-7xl px-4 sm:-mt-10 sm:px-6 lg:-mt-4">
        <StatCards stats={stats} />
      </section>

      {/* trending */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="🔥 Hot right now"
            title="Trending AI Videos"
            subtitle="The most popular AI generated clips everyone is downloading today."
            href="/trending-ai-videos"
          />
        </Reveal>
        <Carousel videos={trending} />
      </section>

      {/* categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Explore"
            title="Popular Categories"
            subtitle="Browse AI videos by theme — there's something for every project."
            href="/categories"
          />
        </Reveal>
        <CategoryGrid categories={categories.filter((c) => c.kind === "folder").slice(0, 12)} />
      </section>

      {/* latest */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="🆕 Fresh"
            title="Latest AI Videos"
            subtitle="Brand new AI generated videos added to the library."
            href="/latest-ai-videos"
          />
        </Reveal>
        <VideoGrid videos={latest} />
      </section>

      {/* SEO content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <SeoBlock title="Free AI Video Download by CodeLove | High-Quality AI Generated Footage">
          <p>
            AIVideos by CodeLove is your ultimate destination for <strong>free AI video downloads</strong>.
            Explore a constantly growing gallery of high-quality{" "}
            <strong>free AI generated videos</strong> spanning anime, cinematic,
            nature, sci-fi, fantasy and vertical AI shorts. Every clip is 100% free to
            download in HD with no watermark and no account required.
          </p>
          <p>
            Whether you need <strong>free AI background videos</strong> for a project,
            trending <strong>free ai Shorts download</strong> for YouTube, or
            cinematic AI footage for your next edit, our CodeLove AI video library is
            updated daily. You can easily find <strong>free ai reels download</strong> options, perfect <strong>free ai videos for youtube upload</strong>, <strong>free ai videos for reels upload</strong>, and <strong>free ai videos for instagram upload</strong> so you always have fresh, copyright-free content ready to go viral.
          </p>
        </SeoBlock>
      </section>

      {/* anime */}
      {animeVids.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="🎴 Stylized"
              title="AI Anime Videos"
              subtitle="Vibrant, stylized AI animation clips for your edits."
              href="/anime-ai-videos"
            />
          </Reveal>
          <Carousel videos={animeVids} />
        </section>
      )}

      {/* cinematic */}
      {cinematicVids.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="🎬 Film-grade"
              title="AI Cinematic Videos"
              subtitle="Dramatic, film-grade AI footage with depth and mood."
              href="/cinematic-ai-videos"
            />
          </Reveal>
          <Carousel videos={cinematicVids} />
        </section>
      )}

      {/* most downloaded */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="⬇️ Fan favorites"
            title="Most Downloaded"
            subtitle="The AI videos creators download the most."
            href="/popular-ai-videos"
          />
        </Reveal>
        <Carousel videos={mostDownloaded} />
      </section>

      {/* nature */}
      {natureVids.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="🌿 Wild"
              title="Nature AI Videos"
              subtitle="Stunning AI generated wildlife and landscapes."
              href="/nature-ai-videos"
            />
          </Reveal>
          <Carousel videos={natureVids} />
        </section>
      )}

      {/* popular grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="⭐ All-time"
            title="Popular AI Videos"
            subtitle="Most-viewed AI videos of all time."
            href="/popular-ai-videos"
          />
        </Reveal>
        <VideoGrid videos={popular} />
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <h2 className="mb-5 text-center text-2xl font-bold">
            Frequently Asked Questions
          </h2>
        </Reveal>
        <div className="space-y-3">
          {HOME_FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl glass p-5 [&_summary]:cursor-pointer"
            >
              <summary className="flex items-center justify-between font-medium marker:content-['']">
                {f.q}
                <span className="text-brand-400 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
