import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Feed } from "@/components/Feed";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/Scripture";
import { CATEGORIES, isCategory, PAGE_SIZE } from "@/lib/constants";
import { SCRIPTURE } from "@/lib/content";
import { safe } from "@/lib/safe";
import { getStore } from "@/lib/store";

export const metadata: Metadata = pageMetadata({
  title: "Prayer Wall: Pray for Others",
  description: `Pray for real people with real needs. Read prayer requests on our free prayer wall, pray over them, and tap "I prayed for this" so they know they are not alone.`,
  path: "/prayer-wall",
});

export default async function PrayerWallPage({ searchParams }: PageProps<"/prayer-wall">) {
  const sp = await searchParams;
  const category = isCategory(sp.category) ? sp.category : null;
  const initial = await safe(
    () => getStore().listPrayers({ category, limit: PAGE_SIZE }),
    { items: [], nextCursor: null },
    "prayer wall",
  );

  const chip = (active: boolean) =>
    `inline-flex min-h-11 items-center rounded-full border px-4 text-base whitespace-nowrap ${
      active ? "border-accent bg-accent text-on-accent font-semibold" : "border-line text-muted hover:text-fg hover:border-accent/60"
    }`;

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Prayer Wall", path: "/prayer-wall" }]} />
      <PageHeader
        eyebrow="Pray for others"
        title="Prayer Wall: Pray for Real Prayer Requests"
        lead="Choose a request, pray for that person, then tap the button so they know someone cared enough to pray."
        verses={SCRIPTURE.pageAnchors.prayerWall}
      />
      <div className="mx-auto max-w-3xl px-4">
        <p className="mb-8 text-lg">
          The prayer wall is where people share what they are carrying and ask others to pray. Every request here was posted by a
          real person, and many are waiting on God for healing, provision, peace, or direction. To pray, read a request, talk to God
          about that person in your own words, then tap &ldquo;I prayed for this&rdquo; so they know someone stood with them. To ask
          for prayer yourself, <Link href="/submit" className="text-accent-ink underline underline-offset-4">submit a prayer request</Link>.
          You can share it here on the wall or keep it private for our prayer team.
        </p>
        <nav aria-label="Filter by category" className="-mx-4 mb-8 overflow-x-auto px-4 pb-2">
          <ul className="flex gap-2">
            <li>
              <Link href="/prayer-wall" className={chip(!category)} aria-current={!category ? "page" : undefined}>
                All
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  href={`/prayer-wall?category=${encodeURIComponent(c)}`}
                  className={chip(category === c)}
                  aria-current={category === c ? "page" : undefined}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Feed
          key={category ?? "all"}
          kind="prayers"
          initial={initial}
          category={category}
          empty={
            <>
              <p className="font-serif text-xl">No requests here yet.</p>
              <p className="mt-2 text-muted">Be the first to ask for prayer.</p>
              <Link href="/submit" className="btn-primary mt-5">
                Submit a Prayer
              </Link>
            </>
          }
        />

        <div className="card mt-12 text-center">
          <h2 className="text-2xl">Need prayer yourself?</h2>
          <p className="mt-2 text-muted">You are welcome here. Share your request and let this community pray for you.</p>
          <Link href="/submit" className="btn-primary mt-5">
            Submit a Prayer
          </Link>
        </div>
      </div>
    </>
  );
}
