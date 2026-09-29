import Link from "next/link";
import { SITE_URL } from "@/lib/site-url";

/** Structured data for search engines. `<` is escaped so text can never close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Visible breadcrumb trail plus the matching BreadcrumbList structured data. */
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
          })),
        }}
      />
    </>
  );
}
