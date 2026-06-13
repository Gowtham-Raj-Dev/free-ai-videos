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
import { faqSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

const HOME_FAQS = [
  {
    q: "Are these AI videos really free to download?",
    a: "Yes. Every AI generated video on AIVideos is 100% free to download in HD with no watermark and no sign-up required.",
  },
  {
    q: "What kinds of AI videos can I download?",
    a: "We offer AI generated videos across many themes including anime, cinematic, nature, sci-fi, fantasy and vertical AI shorts — updated daily.",
  },
  {
    q: "Can I use AI videos for my own projects?",
    a: "Yes, our AI video clips are perfect for reels, edits, backgrounds, and creative projects on any platform.",
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
      <JsonLd data={faqSchema(HOME_FAQS)} />

      <Hero
        floats={trending}
        totalVideos={stats.totalVideos}
        totalDownloads={stats.totalDownloads}
      />

      {/* stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
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
        <CategoryGrid
          categories={categories.filter(
            (c) => c.slug === "ai-animal-videos" || c.kind === "theme",
          )}
        />
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
        <SeoBlock title="Free AI Video Download — Premium AI Generated Videos">
          <p>
            AIVideos is your home for <strong>free AI video downloads</strong>.
            Explore a constantly growing gallery of high-quality{" "}
            <strong>AI generated videos</strong> spanning anime, cinematic,
            nature, sci-fi, fantasy and vertical AI shorts. Every clip is free to
            download in HD with no watermark and no account required.
          </p>
          <p>
            Whether you need <strong>AI background videos</strong> for a project,
            trending <strong>AI shorts</strong> for Reels and TikTok, or
            cinematic AI footage for your next edit, our AI video library is
            updated daily so you always have fresh content.
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
