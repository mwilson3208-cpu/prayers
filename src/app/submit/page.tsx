import type { Metadata } from "next";
import { PageHeader } from "@/components/Scripture";
import { SubmitForm } from "@/components/SubmitForm";
import { SCRIPTURE, youtubeLinks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Submit a Prayer Request",
  description: "Share your prayer request. Real people will pray for you. Keep it private or share it on the prayer wall.",
  alternates: { canonical: "/submit" },
};

export default function SubmitPage() {
  return (
    <>
      <PageHeader
        eyebrow="You do not have to carry this alone"
        title="Submit a Prayer"
        lead="Tell us what is on your heart. Every request is read by a real person and prayed over."
        verses={SCRIPTURE.pageAnchors.submit}
      />
      <div className="mx-auto max-w-2xl px-4">
        <SubmitForm confirmationVerses={SCRIPTURE.confirmation} startHereUrl={youtubeLinks().startHere} />
      </div>
    </>
  );
}
