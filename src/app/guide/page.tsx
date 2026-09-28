import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHeader, Scripture } from "@/components/Scripture";
import { GUIDE, SCRIPTURE, youtubeLinks } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Free 7-Day Prayer Guide",
  description: "A free 7-day prayer guide: one verse, one focus, and one short prayer each day. Seven minutes a day to build a daily habit of prayer.",
  path: "/guide",
});

export default function GuidePage() {
  return (
    <>
      <PageHeader eyebrow="Free guide" title={GUIDE.title} lead={GUIDE.subtitle} verses={SCRIPTURE.pageAnchors.guide} />
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-lg">{GUIDE.intro}</p>
        <div className="card mt-8">
          <h2 className="text-2xl">How to use this guide</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6">
            {GUIDE.howToUse.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
        <ol className="mt-10 space-y-6">
          {GUIDE.days.map((d) => (
            <li key={d.day} id={`day-${d.day}`} className="card scroll-mt-24">
              <p className="eyebrow">Day {d.day}</p>
              <h2 className="mt-1 text-3xl">{d.theme}</h2>
              <Scripture verse={{ reference: d.reference, text: d.verse }} size="sm" className="mt-5" />
              <p className="mt-5">
                <span className="font-semibold">Focus: </span>
                {d.focus}
              </p>
              <p className="mt-4 rounded-xl bg-bg/60 p-4 font-serif text-lg italic">{d.prayer}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-lg">{GUIDE.closing}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={youtubeLinks().channel} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Pray along on YouTube
          </a>
          <Link href="/prayer-wall" className="btn-secondary">
            Visit the prayer wall
          </Link>
        </div>
      </div>
    </>
  );
}
