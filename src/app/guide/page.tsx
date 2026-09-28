import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";
import { PageHeader } from "@/components/Scripture";
import { GUIDE, SCRIPTURE } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free 7-Day Prayer Guide",
  description:
    "Download the free 7-day prayer guide: one verse, one short teaching, one guided prayer, and one action each day. Seven minutes a day to build a prayer habit you can keep.",
  path: "/guide",
});

export default function GuidePage() {
  return (
    <>
      <PageHeader eyebrow="Free prayer guide" title={GUIDE.title} lead={GUIDE.subtitle} verses={SCRIPTURE.pageAnchors.guide} />
      <div className="mx-auto max-w-3xl px-4">
        <section aria-labelledby="get-guide" className="card border-accent/50 sm:p-8">
          <h2 id="get-guide" className="text-2xl sm:text-3xl">
            Get the guide free
          </h2>
          <p className="mt-2 text-muted">Enter your email and you can download it right away. We will also email you a copy.</p>
          <div className="mt-5">
            <NewsletterForm source="guide" size="lg" />
          </div>
          <p className="mt-4 text-sm text-muted">{GUIDE.fileDescription}. No spam. Unsubscribe any time.</p>
        </section>

        <p className="mt-10 text-lg">{GUIDE.intro}</p>

        <h2 className="mt-10 text-2xl">The path</h2>
        <ol className="mt-4 space-y-3">
          {GUIDE.days.map((title, i) => (
            <li key={title} className="flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3">
              <span className="w-16 shrink-0 font-semibold text-accent-ink">Day {i + 1}</span>
              <span className="font-serif text-lg">{title}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
