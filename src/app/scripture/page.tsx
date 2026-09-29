import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHeader } from "@/components/Scripture";
import { PlayIcon } from "@/components/icons";
import { SCRIPTURE, youtubeLinks } from "@/lib/content";
import { nestQuotes } from "@/lib/format";

export const metadata: Metadata = pageMetadata({
  title: "Bible Verses to Pray by Need",
  description: "Bible verses for anxiety, fear, grief, healing, provision, direction, forgiveness, family, salvation, and strength, with a simple way to pray each one.",
  path: "/scripture",
});

export default function ScripturePage() {
  const first = SCRIPTURE.firstTimePrayer;
  return (
    <>
      <PageHeader
        eyebrow="Pray God's Word back to Him"
        title="Scripture for What You Are Facing"
        lead="Choose what you are walking through. Each topic has hand-picked Bible verses and a simple way to pray every one of them."
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
                <p className="mt-1 text-sm font-semibold text-accent-ink">{v.reference}</p>
                <Link href={`/scripture/${need.id}`} className="btn-secondary mt-5 self-start">
                  See all {need.verses.length} verses for {need.title.toLowerCase()}
                </Link>
              </li>
            );
          })}
        </ul>

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
