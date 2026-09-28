import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/unsubscribe", "/guide/thank-you", "/downloads/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
