import Link from "next/link";
import { FAQ, FOUNDER, SITE, featuredVideo, youtubeLinks } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

/** Structured data for search engines. `<` is escaped so text can never close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FOUNDER_ID = `${SITE_URL}/about#founder`;

/** The founder as a schema.org Person (also the author of the Scripture pages). */
export function founderLd() {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FOUNDER.name,
    jobTitle: FOUNDER.jobTitle,
    url: `${SITE_URL}/about#founder`,
    worksFor: { "@id": ORG_ID },
    ...(FOUNDER.bio ? { description: FOUNDER.bio } : {}),
    ...(FOUNDER.photo ? { image: `${SITE_URL}${FOUNDER.photo}` } : {}),
    ...(FOUNDER.links.length ? { sameAs: FOUNDER.links.map((l) => l.url) } : {}),
  };
}

/**
 * Site-wide Organization, WebSite and founder Person, rendered once in the root
 * layout's <head>. There is no site search, so WebSite has no SearchAction.
 * Add more profiles to `social` in content/site.json to extend sameAs.
 */
export function siteGraphLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE.name,
        url: `${SITE_URL}/`,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 },
        description: SITE.description,
        founder: { "@id": FOUNDER_ID },
        sameAs: Array.from(new Set([youtubeLinks().channel, ...SITE.social.map((s) => s.url)])),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE.name,
        url: `${SITE_URL}/`,
        description: SITE.description,
        inLanguage: "en-US",
        publisher: { "@id": ORG_ID },
      },
      founderLd(),
    ],
  };
}

/** FAQPage for any list of visible questions and answers. */
export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

type Crumb = { name: string; path: string };

function breadcrumbList(trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

/** BreadcrumbList structured data only, for pages without a visible trail. */
export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  return <JsonLd data={breadcrumbList([{ name: "Home", path: "/" }, ...items])} />;
}

/** FAQPage structured data for the shared questions in content/faq.json. Pair it with the visible <Faq />. */
export function FaqJsonLd() {
  return <JsonLd data={faqLd(FAQ)} />;
}

/** VideoObject structured data for the featured video. Renders nothing until its title and date are set. */
export function FeaturedVideoJsonLd() {
  const v = featuredVideo();
  if (!v) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: v.title,
        description: v.description,
        thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        uploadDate: v.uploadDate,
        embedUrl: `https://www.youtube.com/embed/${v.id}`,
        contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
      }}
    />
  );
}

/** Visible breadcrumb trail plus the matching BreadcrumbList structured data. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {trail.map((item, i) => (
            <li key={item.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {i === trail.length - 1 ? (
                <span aria-current="page" className="text-fg">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-fg hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbList(trail)} />
    </>
  );
}
