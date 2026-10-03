import type { NextConfig } from "next";
import { execFileSync } from "node:child_process";

// Sitemap lastmod dates: the last git commit that touched each page's files,
// worked out once at build time. Falls back to the build date when git
// history is missing or shallow, so dates are never older than the truth.
const BUILD_TIME = new Date().toISOString();
const SITEMAP_SOURCES: Record<string, string[]> = {
  "/": ["src/app/page.tsx", "content/site.json", "content/faq.json"],
  "/submit": ["src/app/submit/page.tsx", "content/faq.json"],
  "/prayer-wall": ["src/app/prayer-wall/page.tsx"],
  "/answered": ["src/app/answered/page.tsx"],
  "/scripture": ["src/app/scripture/page.tsx", "content/scripture.json"],
  "/scripture/[need]": ["src/app/scripture/[need]/page.tsx", "content/scripture.json"],
  "/watch": ["src/app/watch/page.tsx", "content/site.json"],
  "/7days": ["src/app/7days/page.tsx", "content/guide.json"],
  "/about": ["src/app/about/page.tsx", "content/site.json"],
  "/privacy": ["src/app/privacy/page.tsx"],
  "/terms": ["src/app/terms/page.tsx"],
};

function git(args: string[]) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function sitemapLastmod(): Record<string, string> {
  const fullHistory = git(["rev-parse", "--is-shallow-repository"]) === "false";
  return Object.fromEntries(
    Object.entries(SITEMAP_SOURCES).map(([route, files]) => {
      const date = fullHistory ? git(["log", "-1", "--format=%cI", "--", ...files]) : "";
      return [route, date ? new Date(date).toISOString() : BUILD_TIME];
    }),
  );
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { SITEMAP_LASTMOD: JSON.stringify(sitemapLastmod()), BUILD_TIME },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  async redirects() {
    // The guide landing page moved to a short, easy-to-say address.
    return [{ source: "/guide", destination: "/7days", permanent: true }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
