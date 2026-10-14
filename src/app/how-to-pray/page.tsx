import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, faqLd } from "@/components/JsonLd";
import { PlayIcon } from "@/components/icons";
import { GUIDE, HOW_TO_PRAY, SCRIPTURE, youtubeLinks } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: HOW_TO_PRAY.metaTitle,
  absoluteTitle: true,
  description: HOW_TO_PRAY.description,
  path: "/how-to-pray",
});

export default function HowToPrayPage() {
  const first = SCRIPTURE.firstTimePrayer;
  const url = `${SITE_URL}/how-to-pray`;
  const steps = first.steps.map((text, i) => ({ name: HOW_TO_PRAY.stepNames[i] ?? `Step ${i + 1}`, text }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: first.title,
          description: HOW_TO_PRAY.directAnswer,
          url,
          inLanguage: "en-US",
          totalTime: "PT5M",
          step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text, url: `${url}#step-${i + 1}` })),
        }}
      />
      <JsonLd data={faqLd(HOW_TO_PRAY.faq)} />
      <header className="glow">
        <div className="mx-auto max-w-3xl px-4 pt-8 pb-8 sm:pt-12">
          <Breadcrumbs items={[{ name: "How to Pray", path: "/how-to-pray" }]} />
          <p className="eyebrow mt-8">A beginner&apos;s guide</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">{first.title}</h1>
          <p className="mt-4 text-lg sm:text-xl">{HOW_TO_PRAY.directAnswer}</p>
          <p className="mt-4 text-muted">{first.intro}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4">
        <section aria-labelledby="steps-h">
          <h2 id="steps-h" className="text-3xl">
            How do I pray? {steps.length} simple steps
          </h2>
          <ol className="mt-6 space-y-5">
            {steps.map((s, i) => (
              <li key={s.name} id={`step-${i + 1}`} className="card scroll-mt-24">
                <h3 className="text-2xl">
                  <span className="text-accent-ink">{i + 1}.</span> {s.name}
                </h3>
                <p className="mt-2 text-lg">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="salvation-h" className="card glow mt-14 border-accent/50 sm:p-8">
          <h2 id="salvation-h" className="text-2xl sm:text-3xl">
            A prayer to begin a relationship with Jesus
          </h2>
          <p className="mt-3">{first.salvationIntro}</p>
          <blockquote className="mt-5 border-l-2 border-accent pl-5 font-serif text-xl leading-relaxed italic">{first.salvationPrayer}</blockquote>
          <p className="mt-5">{first.afterPrayer}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={youtubeLinks().firstPrayer} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <PlayIcon /> Watch: praying for the first time
            </a>
            <Link href="/about#contact" className="btn-secondary">
              Tell us you prayed
            </Link>
          </div>
        </section>

        <section aria-labelledby="faq-h" className="mt-14">
          <h2 id="faq-h" className="text-3xl">
            Questions about prayer
          </h2>
          <div className="mt-6 space-y-8">
            {HOW_TO_PRAY.faq.map((f) => (
              <div key={f.q}>
                <h3 className="text-2xl">{f.q}</h3>
                <p className="mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="next-h" className="card mt-14 sm:p-8">
          <h2 id="next-h" className="text-2xl sm:text-3xl">
            Keep praying for the next 7 days
          </h2>
          <p className="mt-3 text-muted">
            {GUIDE.title} is a free guide that walks you through seven minutes of prayer a day: one verse, one short teaching, one
            guided prayer.
          </p>
          <Link href="/7days" className="btn-primary mt-5">
            Get the free 7-Day Prayer Guide
          </Link>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/prayer/anxiety" className="text-accent-ink underline underline-offset-4">
              Prayers for anxiety
            </Link>
            <Link href="/scripture" className="text-accent-ink underline underline-offset-4">
              Bible verses by need
            </Link>
            <Link href="/submit" className="text-accent-ink underline underline-offset-4">
              Submit a prayer request
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
