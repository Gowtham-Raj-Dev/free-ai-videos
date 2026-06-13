import type { Theme } from "./categories";
import { seededRandom } from "./utils";

interface Bank {
  adj: string[];
  subject: string[];
  scene: string[];
  tags: string[];
}

const BANKS: Record<Theme, Bank> = {
  nature: {
    adj: ["Majestic", "Wild", "Untamed", "Serene", "Golden Hour", "Misty", "Graceful"],
    subject: ["Lioness", "Eagle", "Wolf Pack", "Bengal Tiger", "Elephant Herd", "Hummingbird", "Snow Leopard"],
    scene: ["in the Wild", "at Dawn", "Across the Savanna", "in Slow Motion", "by the River"],
    tags: ["nature", "wildlife", "animals", "4k", "landscape", "documentary"],
  },
  cinematic: {
    adj: ["Epic", "Dramatic", "Moody", "Anamorphic", "Sweeping", "Atmospheric"],
    subject: ["Predator", "Wild Stallion", "Falcon", "Black Panther", "Lone Wolf"],
    scene: ["in Cinematic 4K", "Under Storm Light", "in Shallow Focus", "at Blue Hour"],
    tags: ["cinematic", "film", "dramatic", "4k", "moody", "trailer"],
  },
  fantasy: {
    adj: ["Mythic", "Enchanted", "Celestial", "Ancient", "Ethereal", "Glowing"],
    subject: ["Dragon", "Phoenix", "Spirit Fox", "Griffin", "Frost Wolf", "Sky Whale"],
    scene: ["in a Dreamscape", "Over Floating Isles", "in the Enchanted Forest", "Among the Stars"],
    tags: ["fantasy", "magic", "mythical", "surreal", "dreamscape", "creature"],
  },
  scifi: {
    adj: ["Neon", "Cybernetic", "Holographic", "Synthetic", "Chrome", "Quantum"],
    subject: ["Mech Beast", "Robo Falcon", "Bio Drone", "Cyber Tiger", "Android Wolf"],
    scene: ["in Neon City", "Beyond the Stars", "in a Cyber Jungle", "on a Distant Planet"],
    tags: ["scifi", "futuristic", "cyberpunk", "neon", "tech", "future"],
  },
  anime: {
    adj: ["Vivid", "Pastel", "Sakura", "Luminous", "Dreamy", "Stylized"],
    subject: ["Spirit Beast", "Guardian Fox", "Cloud Whale", "Koi Dragon", "Lantern Cat"],
    scene: ["Under Cherry Blossoms", "at Sunset", "in a Floating City", "by the Shrine"],
    tags: ["anime", "animation", "stylized", "vibrant", "manga", "amv"],
  },
  shorts: {
    adj: ["Adorable", "Looping", "Snappy", "Playful", "Tiny", "Fluffy"],
    subject: ["Kitten", "Puppy", "Fox Cub", "Baby Panda", "Otter", "Penguin Chick"],
    scene: ["Caught on Loop", "in 9:16", "Up Close", "Being Cute"],
    tags: ["shorts", "reels", "vertical", "loop", "cute", "viral"],
  },
};

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length) % arr.length];
}

export function generateTitle(seed: number, theme: Theme): string {
  const b = BANKS[theme];
  const adj = pick(b.adj, seed + 1);
  const subject = pick(b.subject, seed + 7);
  const scene = pick(b.scene, seed + 13);
  return `${adj} ${subject} ${scene}`;
}

export function generateTags(seed: number, theme: Theme): string[] {
  const base = BANKS[theme].tags;
  const extra = ["ai generated", "ai video", "free download", "hd", "no watermark"];
  const shuffled = [...base].sort(
    (a, b) => seededRandom(seed + a.length) - seededRandom(seed + b.length),
  );
  return Array.from(new Set([...shuffled.slice(0, 4), ...extra.slice(0, 2)]));
}

export function generateDescription(
  title: string,
  theme: Theme,
  category: string,
): string {
  return `${title} — a high-quality AI generated ${theme} video from our ${category} collection. Download this premium AI clip for free in HD with no watermark and no sign-up. Perfect for reels, edits, backgrounds and creative projects.`;
}
