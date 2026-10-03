import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Feed } from "@/components/Feed";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/Scripture";
import { TestimonyForm } from "@/components/TestimonyForm";
import { PAGE_SIZE } from "@/lib/constants";
import { SCRIPTURE } from "@/lib/content";
import { safe } from "@/lib/safe";
import { getStore } from "@/lib/store";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Answered Prayers and Testimonies",
  description: "Read true stories of answered prayer and give thanks to God for His faithfulness. Share how God answered your prayer.",
  path: "/answered",
});

export default async function AnsweredPage() {
  const initial = await safe(() => getStore().listTestimonies({ limit: PAGE_SIZE }), { items: [], nextCursor: null }, "answered");
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Give Thanks", path: "/answered" }]} />
      <PageHeader
        eyebrow="Give thanks"
        title="Answered Prayers"
        lead="When God answers, come back and say thank you. Your story will strengthen someone who is still waiting."
        verses={SCRIPTURE.pageAnchors.answered}
      />
      <div className="mx-auto max-w-3xl px-4">
        <section aria-labelledby="share-heading">
          <h2 id="share-heading" className="mb-5 text-3xl">
            Share what God has done
          </h2>
          <TestimonyForm />
        </section>

        <section aria-labelledby="wall-heading" className="mt-16">
          <h2 id="wall-heading" className="mb-5 text-3xl">
            Testimonies of God&apos;s faithfulness
          </h2>
          <Feed
            kind="testimonies"
            initial={initial}
            empty={<p className="text-muted">No testimonies yet. Be the first to give thanks.</p>}
          />
        </section>
      </div>
    </>
  );
}
