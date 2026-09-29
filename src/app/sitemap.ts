import type { MetadataRoute } from "next";
import { SCRIPTURE } from "@/lib/content";
import { safe } from "@/lib/safe";
import { SITE_URL } from "@/lib/site-url";
import { getStore } from "@/lib/store";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "daily"],
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
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${SITE_URL}${path}`, priority, changeFrequency })),
    ...SCRIPTURE.needs.map((n) => ({ url: `${SITE_URL}/scripture/${n.id}`, priority: 0.8, changeFrequency: "monthly" as const })),
    ...prayers.map((p) => ({ url: `${SITE_URL}/prayer-wall/${p.id}`, lastModified: p.createdAt, priority: 0.4 })),
  ];
}
