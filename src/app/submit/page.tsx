import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Faq } from "@/components/Faq";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/Scripture";
import { SubmitForm } from "@/components/SubmitForm";
import { SCRIPTURE, youtubeLinks } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Submit a Prayer Request",
  description: "Share your prayer request and real people will pray for you. Free, private if you want, and read by a real person every time.",
  path: "/submit",
});

export default function SubmitPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Submit a Prayer", path: "/submit" }]} />
      <PageHeader
        eyebrow="You do not have to carry this alone"
        title="Submit a Prayer"
        lead="Tell us what is on your heart. Every request is read by a real person and prayed over."
        verses={SCRIPTURE.pageAnchors.submit}
      />
      <div className="mx-auto max-w-2xl px-4">
        <SubmitForm confirmationVerses={SCRIPTURE.confirmation} startHereUrl={youtubeLinks().startHere} />
      </div>
      <Faq />
    </>
  );
}
