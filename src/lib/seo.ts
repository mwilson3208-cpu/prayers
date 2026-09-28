import type { Metadata } from "next";
import { SITE } from "./content";

/**
 * Metadata for one page. Next.js replaces (does not merge) the layout's
 * openGraph and twitter objects, so every page sets its own full set here:
 * canonical URL, share URL, title, description, and preview image.
 */
export function pageMetadata({
  title,
  description,
  path,
  shareTitle,
  image = true,
}: {
  title: string;
  description: string;
  path: string;
  shareTitle?: string;
  /** Set false when the route has its own opengraph-image file. */
  image?: boolean;
}): Metadata {
  const ogTitle = shareTitle ?? (path === "/" ? title : `${title} | ${SITE.name}`);
  const images = image ? [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE.name}: ${SITE.tagline}` }] : undefined;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "en_US",
      url: path,
      title: ogTitle,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}
