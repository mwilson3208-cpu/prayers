import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, FOUNDER_ID, JsonLd, ORG_ID, faqLd, founderLd } from "@/components/JsonLd";
import { FOUNDER, PRAYER_TOPICS, getNeed, getPrayerTopic } from "@/lib/content";
import { formatDate, nestQuotes } from "@/lib/format";
import { pageDates } from "@/lib/page-dates";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRAYER_TOPICS.map((t) => ({ topic: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/prayer/[topic]">): Promise<Metadata> {
  const t = getPrayerTopic((await params).topic);
  if (!t) return {};
  return pageMetadata({ title: t.metaTitle, absoluteTitle: true, description: t.description, path: `/prayer/${t.id}` });
}

export default async function PrayerTopicPage({ params }: PageProps<"/prayer/[topic]">) {
  const t = getPrayerTopic((await params).topic);
  if (!t) notFound();
  const need = getNeed(t.scripture);
  const url = `${SITE_URL}/prayer/${t.id}`;
  const dates = pageDates("/prayer/[topic]");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${url}#article`,
          headline: t.title,
          description: t.directAnswer,
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
      <JsonLd data={faqLd(t.faq)} />
      <header className="glow">
        <div className="mx-auto max-w-3xl px-4 pt-8 pb-8 sm:pt-12">
          <Breadcrumbs items={[{ name: t.title, path: `/prayer/${t.id}` }]} />
          <p className="eyebrow mt-8">{t.eyebrow}</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">{t.title}</h1>
          <p className="mt-4 text-lg sm:text-xl">{t.directAnswer}</p>
          <p className="mt-4 text-muted">{t.intro}</p>
          <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <span>
              Written by{" "}
              <Link href="/about#founder" className="text-fg underline-offset-4 hover:underline">
                {FOUNDER.name}
              </Link>
            </span>
            <span>
              Last updated <time dateTime={dates.modified}>{formatDate(dates.modified)}</time>
            </span>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4">
        <section aria-labelledby="prayers-h">
          <h2 id="prayers-h" className="text-3xl">
            {t.prayers.length} {t.title.toLowerCase().startsWith("night") ? "night prayers" : "prayers"} you can pray right now
          </h2>
          <ol className="mt-6 space-y-5">
            {t.prayers.map((p) => (
              <li key={p.title} className="card">
                <h3 className="text-2xl">{p.title}</h3>
                <p className="mt-3 font-serif text-xl leading-relaxed">{p.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {need && (
          <section aria-labelledby="scripture-h" className="card glow mt-14 sm:p-8">
            <h2 id="scripture-h" className="text-2xl sm:text-3xl">
              Pray with Scripture
            </h2>
            <p className="mt-4 font-serif text-xl leading-snug italic">&ldquo;{nestQuotes(need.verses[0].text)}&rdquo;</p>
            <p className="mt-1 text-sm font-semibold text-accent-ink">
              {need.verses[0].reference} ({need.translation})
            </p>
            <Link href={`/scripture/${need.id}`} className="btn-secondary mt-5">
              Read {need.verses.length} {need.heading.replace(/^Bible Verses/, "Bible verses")}
            </Link>
          </section>
        )}

        <section aria-labelledby="faq-h" className="mt-14">
          <h2 id="faq-h" className="text-3xl">
            Questions about {t.title.toLowerCase()}
          </h2>
          <div className="mt-6 space-y-8">
            {t.faq.map((f) => (
              <div key={f.q}>
                <h3 className="text-2xl">{f.q}</h3>
                <p className="mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="ask-h" className="card glow mt-14 border-accent/50 sm:p-8">
          <h2 id="ask-h" className="text-2xl sm:text-3xl">
            Let us pray with you
          </h2>
          <p className="mt-3 text-muted">
            You do not have to pray alone. When you{" "}
            <Link href="/submit" className="text-accent-ink underline underline-offset-4">
              submit a prayer request
            </Link>
            , a real person reads it and prays for you. You can also pray for others on the{" "}
            <Link href="/prayer-wall" className="text-accent-ink underline underline-offset-4">
              prayer wall
            </Link>
            .
          </p>
          <Link href="/submit" className="btn-primary mt-6">
            Ask for prayer
          </Link>
        </section>

        <section aria-labelledby="related-h" className="mt-14">
          <h2 id="related-h" className="text-2xl">
            Keep going
          </h2>
          <ul className="mt-4 space-y-2">
            {t.related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="text-accent-ink underline underline-offset-4">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
