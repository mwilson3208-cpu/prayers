import type { MetadataRoute } from "next";
import { SCRIPTURE } from "@/lib/content";
import { pageDates } from "@/lib/page-dates";
import { SITE_URL } from "@/lib/site-url";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

// Every indexable page. Noindexed pages (single prayer requests, thank-you,
// unsubscribe, admin) are deliberately left out.
const PAGES: [path: string, priority: number, changeFrequency: Freq][] = [
  ["/", 1, "daily"],
  ["/submit", 0.9, "monthly"],
  ["/prayer-wall", 0.9, "hourly"],
  ["/answered", 0.8, "daily"],
  ["/scripture", 0.8, "monthly"],
  ["/watch", 0.7, "weekly"],
  ["/7days", 0.8, "monthly"],
  ["/about", 0.5, "monthly"],
  ["/privacy", 0.2, "yearly"],
  ["/terms", 0.2, "yearly"],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // The homepage keeps its trailing slash so it matches the canonical URL exactly.
    ...PAGES.map(([path, priority, changeFrequency]) => ({
      url: `${SITE_URL}${path}`,
      lastModified: pageDates(path).modified,
      priority,
      changeFrequency,
    })),
    ...SCRIPTURE.needs.map((n) => ({
      url: `${SITE_URL}/scripture/${n.id}`,
      lastModified: pageDates("/scripture/[need]").modified,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
  ];
}
