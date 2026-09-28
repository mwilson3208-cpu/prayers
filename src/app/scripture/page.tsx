import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHeader } from "@/components/Scripture";
import { PlayIcon } from "@/components/icons";
import { SCRIPTURE, youtubeLinks } from "@/lib/content";

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
        lead="Find what you are walking through, read the verses slowly, and use the short note under each one to turn it into prayer."
        verses={SCRIPTURE.pageAnchors.scripture}
      />
      <div className="mx-auto max-w-3xl px-4">
        <nav aria-label="Needs" className="card">
          <p className="font-semibold">Jump to:</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SCRIPTURE.needs.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="flex min-h-11 items-center rounded-lg px-2 text-accent-ink underline-offset-4 hover:underline">
                  {n.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#first-prayer" className="flex min-h-11 items-center rounded-lg px-2 text-accent-ink underline-offset-4 hover:underline">
                First-time prayer
              </a>
            </li>
          </ul>
        </nav>

        {SCRIPTURE.needs.map((need) => (
          <section key={need.id} id={need.id} aria-labelledby={`${need.id}-h`} className="mt-14 scroll-mt-24">
            <h2 id={`${need.id}-h`} className="text-3xl">
              {need.title}
            </h2>
            <p className="mt-2 text-muted">{need.intro}</p>
            <ul className="mt-6 space-y-4">
              {need.verses.map((v) => (
                <li key={v.reference} className="card">
                  <p className="font-serif text-xl leading-snug italic">&ldquo;{v.text}&rdquo;</p>
                  <p className="mt-2 font-semibold text-accent-ink">{v.reference}</p>
                  <p className="mt-3 border-t border-line pt-3 text-base">
                    <span className="font-semibold">Pray it: </span>
                    {v.howToPray}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}

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
