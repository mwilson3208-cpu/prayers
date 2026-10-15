import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, FOUNDER_ID, JsonLd, ORG_ID, faqLd, founderLd } from "@/components/JsonLd";
import { FOUNDER, PRAYER_TOPICS, SCRIPTURE, getNeed } from "@/lib/content";
import { clip, formatDate, nestQuotes } from "@/lib/format";
import { pageDates } from "@/lib/page-dates";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

export const dynamicParams = false;

export function generateStaticParams() {
  return SCRIPTURE.needs.map((n) => ({ need: n.id }));
}

export async function generateMetadata({ params }: PageProps<"/scripture/[need]">): Promise<Metadata> {
  const need = getNeed((await params).need);
  if (!need) return {};
  const count = need.verses.length;
  return pageMetadata({
    // The layout adds " | Closer to the Father"; metaTitle keeps long topics under 60 characters.
    title: need.metaTitle ?? need.heading,
    description: clip(
      `${count} ${need.heading.replace(/^Bible Verses/, "Bible verses")} from the World English Bible, each explained in plain words, plus a short prayer and answers to common questions.`,
      160,
    ),
    path: `/scripture/${need.id}`,
  });
}

export default async function NeedPage({ params }: PageProps<"/scripture/[need]">) {
  const need = getNeed((await params).need);
  if (!need) notFound();
  const related = need.related.map((id) => getNeed(id)).filter((n): n is NonNullable<typeof n> => Boolean(n));
  const url = `${SITE_URL}/scripture/${need.id}`;
  const dates = pageDates("/scripture/[need]");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${url}#article`,
          headline: need.heading,
          description: need.directAnswer,
          url,
          mainEntityOfPage: url,
          image: `${SITE_URL}/opengraph-image`,
          inLanguage: "en-US",
          datePublished: dates.published,
          dateModified: dates.modified,
          author: { ...founderLd(), "@id": FOUNDER_ID },
          publisher: { "@id": ORG_ID },
        }}
      />
      <JsonLd data={faqLd([{ q: need.versesQuestion, a: need.versesIntro }, ...need.questions])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: need.heading,
          url,
          numberOfItems: need.verses.length,
          itemListElement: need.verses.map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: v.reference,
            url: `${url}#verse-${i + 1}`,
          })),
        }}
      />
      <header className="glow">
        <div className="mx-auto max-w-3xl px-4 pt-8 pb-8 sm:pt-12">
          <Breadcrumbs
            items={[
              { name: "Scripture", path: "/scripture" },
              { name: need.title, path: `/scripture/${need.id}` },
            ]}
          />
          <p className="eyebrow mt-8">Scripture to pray</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">{need.heading}</h1>
          {/* Direct answer to "What does the Bible say about <topic>?" */}
          <p className="mt-4 text-lg sm:text-xl">{need.directAnswer}</p>
          <p className="mt-4 text-muted">{need.intro}</p>
          <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <span>
              Written by{" "}
              <Link href="/about#founder" className="text-fg underline-offset-4 hover:underline">
                {FOUNDER.name}
              </Link>
            </span>
            <span>
              Published <time dateTime={dates.published}>{formatDate(dates.published)}</time>
            </span>
            <span>
              Last updated <time dateTime={dates.modified}>{formatDate(dates.modified)}</time>
            </span>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4">
        <section aria-labelledby="verses-h">
          <h2 id="verses-h" className="text-3xl">
            {need.versesQuestion}
          </h2>
          <p className="mt-3 text-muted">{need.versesIntro}</p>
          <ol className="mt-6 space-y-5">
            {need.verses.map((v, i) => (
              <li key={v.reference} id={`verse-${i + 1}`} className="card scroll-mt-24">
                <h3 className="text-xl text-accent-ink">
                  {v.reference} <span className="text-sm font-normal text-muted">({need.translation})</span>
                </h3>
                <p className="mt-3 font-serif text-xl leading-snug italic">&ldquo;{nestQuotes(v.text)}&rdquo;</p>
                <p className="mt-4 border-t border-line pt-3">{v.note}</p>
              </li>
            ))}
          </ol>
        </section>

        {need.questions.map((q, i) => (
          <section key={q.q} aria-labelledby={`q-${i}`} className="mt-14">
            <h2 id={`q-${i}`} className="text-3xl">
              {q.q}
            </h2>
            <p className="mt-4 text-lg">{q.a}</p>
          </section>
        ))}

        <section aria-labelledby="prayer-h" className="mt-14">
          <h2 id="prayer-h" className="text-3xl">
            A prayer for {need.keyword}
          </h2>
          <blockquote className="mt-5 border-l-2 border-accent pl-5 font-serif text-xl leading-relaxed italic">{need.prayer}</blockquote>
        </section>

        <section aria-labelledby="pray-with-us" className="card glow mt-14 border-accent/50 sm:p-8">
          <h2 id="pray-with-us" className="text-2xl sm:text-3xl">
            You do not have to carry this alone
          </h2>
          <p className="mt-3 text-muted">
            Share what you are facing when you{" "}
            <Link href="/submit" className="text-accent-ink underline underline-offset-4">
              submit a prayer request
            </Link>
            , and real people will pray for you. Keep it private or post it on the{" "}
            <Link href="/prayer-wall" className="text-accent-ink underline underline-offset-4">
              prayer wall
            </Link>
            .
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={`/submit?category=${encodeURIComponent(need.prayerCategory)}`} className="btn-primary">
              Ask for prayer
            </Link>
            <Link href="/7days" className="btn-secondary">
              Get the free 7-Day Prayer Guide
            </Link>
          </div>
        </section>

        <section aria-labelledby="more-verses" className="mt-14">
          <h2 id="more-verses" className="text-2xl">
            Related Scripture
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {related.map((n) => (
              <li key={n.id}>
                <Link href={`/scripture/${n.id}`} className="card block py-4 hover:border-accent/60">
                  <span className="font-serif text-lg">{n.heading}</span>
                  <span className="mt-1 block text-sm text-muted">{n.verses.length} verses, explained</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {PRAYER_TOPICS.filter((t) => t.id === need.id).map((t) => (
              <Link key={t.id} href={`/prayer/${t.id}`} className="text-accent-ink underline underline-offset-4">
                {t.title}
              </Link>
            ))}
            <Link href="/scripture" className="text-accent-ink underline underline-offset-4">
              All Scripture topics
            </Link>
            <Link href="/scripture#first-prayer" className="text-accent-ink underline underline-offset-4">
              Never prayed before? Start here.
            </Link>
          </p>
          <p className="mt-8 text-sm text-muted">{SCRIPTURE.needsTranslation.notice}</p>
        </section>
      </div>
    </>
  );
}
