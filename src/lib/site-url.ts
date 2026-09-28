// Safe to use from server and client code.
// NEXT_PUBLIC_SITE_URL wins. On Vercel, fall back to the production domain
// Vercel provides, so canonical links and share URLs never point at localhost.
const configured =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const SITE_URL = configured.replace(/\/$/, "");
