import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/Scripture";
import { SITE } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: "The simple rules for sharing prayer requests and testimonies on Closer to the Father, in plain English.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Plain English" title="Terms of Use" lead="Last updated September 27, 2026." />
      <div className="prose-page mx-auto max-w-3xl px-4">
        <p>By using {SITE.name}, you agree to these simple terms. They exist to keep this a safe, kind place to pray.</p>

        <h2>Be kind and honest</h2>
        <ul>
          <li>Share real prayer requests and real testimonies.</li>
          <li>Do not post anything hateful, abusive, sexual, or threatening.</li>
          <li>Do not post ads, links, or anything selling a product or service.</li>
          <li>Do not share someone else&apos;s private details without their permission.</li>
        </ul>

        <h2>We watch over every post</h2>
        <p>
          Public prayer requests and answered prayers may appear on the site right away, and our team reads every one. We may edit, hide, or delete any post for any reason, including to protect someone&apos;s privacy. We
          cannot guarantee that every post will be published.
        </p>

        <h2>Prayer is not professional advice</h2>
        <p>
          We are a prayer community, not doctors, counselors, lawyers, or financial advisors. Please get professional help when you
          need it. If you are in crisis or thinking about harming yourself, call or text 988 in the United States, or call 911 if
          you are in immediate danger.
        </p>

        <h2>What you share</h2>
        <p>
          You keep ownership of what you write. By posting publicly, you allow us to show it on this site and share it (without
          your email) to encourage others, for example on our YouTube channel or social pages.
        </p>

        <h2>No guarantees</h2>
        <p>
          We work hard to keep the site running and safe, but it is provided as is, for free. We are not responsible for what other
          visitors post, and we cannot promise the site will always be available.
        </p>

        <h2>Changes</h2>
        <p>We may update these terms. If we do, we will change the date at the top of this page.</p>
      </div>
    </>
  );
}
