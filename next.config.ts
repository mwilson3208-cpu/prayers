import type { NextConfig } from "next";
import { pageDates } from "./scripts/lastmod.mjs";

// Per-page published/modified dates (git, or content/lastmod.json on shallow
// clones), inlined at build time for the sitemap and Article structured data.
const BUILD_TIME = new Date().toISOString();

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { PAGE_DATES: JSON.stringify(pageDates()), BUILD_TIME },
  images: {
    formats: ["image/avif", "image/webp"],
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
