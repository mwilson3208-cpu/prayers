import type { MetadataRoute } from "next";
import { SCRIPTURE } from "@/lib/content";
import { safe } from "@/lib/safe";
import { SITE_URL } from "@/lib/site-url";
import { getStore } from "@/lib/store";

export const revalidate = 3600;

// Filled in at build time by next.config.ts (last git commit date per page, or the build date).
const LASTMOD: Record<string, string> = JSON.parse(process.env.SITEMAP_LASTMOD || "{}");
const lastModified = (route: string) => LASTMOD[route] ?? process.env.BUILD_TIME ?? new Date().toISOString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
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
  const prayers = await safe(() => getStore().listApprovedPrayerIds(500), [], "sitemap");
  return [
    // The homepage keeps its trailing slash so it matches the canonical URL exactly.
    ...pages.map(([path, priority, changeFrequency]) => ({
      url: `${SITE_URL}${path}`,
      lastModified: lastModified(path),
      priority,
      changeFrequency,
    })),
    ...SCRIPTURE.needs.map((n) => ({
      url: `${SITE_URL}/scripture/${n.id}`,
      lastModified: lastModified("/scripture/[need]"),
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...prayers.map((p) => ({ url: `${SITE_URL}/prayer-wall/${p.id}`, lastModified: p.createdAt, priority: 0.4 })),
  ];
}
