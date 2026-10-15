// Per-page dates worked out at build time by scripts/lastmod.mjs (see next.config.ts).
export type PageDates = { published: string; modified: string };

const DATES: Record<string, PageDates> = JSON.parse(process.env.PAGE_DATES || "{}");
const FALLBACK = process.env.BUILD_TIME || new Date().toISOString();

/** Dates for a route as listed in content/sitemap-sources.json, e.g. "/" or "/scripture/[need]". */
export function pageDates(route: string): PageDates {
  return DATES[route] ?? { published: FALLBACK, modified: FALLBACK };
}
