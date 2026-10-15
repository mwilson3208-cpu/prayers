import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

const PRIVATE = ["/admin", "/api/", "/unsubscribe", "/guide/thank-you", "/downloads/"];

// Search and AI crawlers we explicitly welcome. Each gets the same rule as
// everyone else; naming them makes the intent clear and survives any future
// blanket rule.
const NAMED_BOTS = ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...NAMED_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
      { userAgent: "*", allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
