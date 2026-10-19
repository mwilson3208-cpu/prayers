import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { BreadcrumbJsonLd, JsonLd, faqLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/Scripture";
import { PlayIcon } from "@/components/icons";
import { SCRIPTURE, youtubeLinks } from "@/lib/content";
import { nestQuotes } from "@/lib/format";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Bible Verses to Pray by Need",
  description: "Bible verses for anxiety, fear, grief, healing, provision, direction, forgiveness, family, salvation, and strength, explained in plain words with prayers.",
  path: "/scripture",
});

export default function ScripturePage() {
  const first = SCRIPTURE.firstTimePrayer;
  // Visible questions below, also sent as FAQPage structured data.
  const faqs = SCRIPTURE.needs.map((n) => ({ id: n.id, q: `What does the Bible say about ${n.keyword}?`, a: n.directAnswer }));
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Scripture", path: "/scripture" }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Bible verses by need",
          url: `${SITE_URL}/scripture`,
          numberOfItems: SCRIPTURE.needs.length,
          itemListElement: SCRIPTURE.needs.map((n, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: n.heading,
            url: `${SITE_URL}/scripture/${n.id}`,
          })),
        }}
      />
      <JsonLd data={faqLd(faqs)} />
      <PageHeader
        eyebrow="Pray God's Word back to Him"
        title="Scripture for What You Are Facing"
        lead="Choose what you are walking through. Each topic has 20 or more Bible verses explained in plain words, answers to common questions, and a prayer you can pray today."
        verses={SCRIPTURE.pageAnchors.scripture}
      />
      <div className="mx-auto max-w-3xl px-4">
        <nav aria-label="Needs" className="card">
          <p className="font-semibold">Jump to:</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SCRIPTURE.needs.map((n) => (
              <li key={n.id}>
                <Link href={`/scripture/${n.id}`} className="flex min-h-11 items-center rounded-lg px-2 text-accent-ink underline-offset-4 hover:underline">
                  {n.title}
                </Link>
              </li>
            ))}
            <li>
              <a href="#first-prayer" className="flex min-h-11 items-center rounded-lg px-2 text-accent-ink underline-offset-4 hover:underline">
                First-time prayer
              </a>
            </li>
          </ul>
        </nav>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {SCRIPTURE.needs.map((need) => {
            const v = need.verses[0];
            return (
              <li key={need.id} id={need.id} className="card flex scroll-mt-24 flex-col">
                <h2 className="text-2xl">
                  <Link href={`/scripture/${need.id}`} className="hover:underline">
                    {need.heading}
                  </Link>
                </h2>
                <p className="mt-2 text-muted">{need.intro}</p>
                <p className="mt-4 font-serif text-lg italic leading-snug">&ldquo;{nestQuotes(v.text)}&rdquo;</p>
                <p className="mt-1 text-sm font-semibold text-accent-ink">
                  {v.reference} ({need.translation})
                </p>
                <Link href={`/scripture/${need.id}`} className="btn-secondary mt-5 self-start">
                  See all {need.verses.length} verses for {need.title.toLowerCase()}
                </Link>
              </li>
            );
          })}
        </ul>

        <section aria-labelledby="prayers-h" className="mt-16">
          <h2 id="prayers-h" className="text-3xl">
            Prayers you can pray today
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["/how-to-pray", "How to Pray for the First Time", "A simple 5-step guide for beginners"],
              ["/prayer/anxiety", "Prayer for Anxiety", "Six prayers for a worried heart"],
              ["/prayer/sleep", "Night Prayers for Sleep", "Bedtime prayers for rest and peace"],
            ].map(([href, title, sub]) => (
              <li key={href}>
                <Link href={href} className="card block h-full py-4 hover:border-accent/60">
                  <span className="font-serif text-lg">{title}</span>
                  <span className="mt-1 block text-sm text-muted">{sub}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="bible-says-h" className="mt-16">
          <h2 id="bible-says-h" className="text-3xl">
            What does the Bible say?
          </h2>
          <div className="mt-6 space-y-8">
            {faqs.map((f) => (
              <div key={f.id}>
                <h3 className="text-2xl">{f.q}</h3>
                <p className="mt-2">{f.a}</p>
                <Link href={`/scripture/${f.id}`} className="mt-2 inline-block text-accent-ink underline underline-offset-4">
                  Read the verses
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section id="first-prayer" aria-labelledby="first-h" className="mt-16 scroll-mt-24">
          <div className="card glow border-accent/50 sm:p-8">
            <p className="eyebrow">Start here</p>
            <h2 id="first-h" className="mt-2 text-3xl">
              {first.title}
            </h2>
            <p className="mt-4">{first.intro}</p>
            <ol className="mt-5 list-decimal space-y-2 pl-6">
              {first.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <h3 className="mt-8 text-2xl">A prayer to begin a relationship with Jesus</h3>
            <p className="mt-3">{first.salvationIntro}</p>
            <blockquote className="mt-5 border-l-2 border-accent pl-5 font-serif text-xl leading-relaxed italic">{first.salvationPrayer}</blockquote>
            <p className="mt-5">{first.afterPrayer}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={youtubeLinks().firstPrayer} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <PlayIcon /> Watch: praying for the first time
              </a>
              <Link href="/how-to-pray" className="btn-secondary">
                Read the full guide
              </Link>
              <Link href="/about#contact" className="btn-secondary">
                Tell us you prayed
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
