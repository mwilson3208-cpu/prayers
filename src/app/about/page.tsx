import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/Scripture";
import { PlayIcon } from "@/components/icons";
import { SCRIPTURE, SITE, youtubeLinks } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "About Our Prayer Ministry",
  description: "Why Closer to the Father exists, who runs it, what we believe, and how to contact our prayer team.",
  path: "/about",
});

export default function AboutPage() {
  const yt = youtubeLinks();
  return (
    <>
      <PageHeader eyebrow="About us" title="Why this place exists" lead={SITE.mission} verses={SCRIPTURE.pageAnchors.about} />
      <div className="prose-page mx-auto max-w-3xl px-4">
        <h2>Our mission</h2>
        <p>
          {SITE.name} exists to bring people to Jesus and closer to the Father. We believe a few honest minutes with God each day
          can change a life. The YouTube channel offers guided prayers and daily devotionals. This site is where the community
          meets: to ask for prayer, to pray for each other, and to thank God together when He answers.
        </p>

        <h2>Why it is free</h2>
        <p>{SITE.about.whyFree}</p>

        <h2>Who runs it</h2>
        <p>{SITE.about.whoRunsIt}</p>

        <h2>What we believe</h2>
        <ul>
          {SITE.about.statementOfFaith.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h2>Find us</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={yt.channel} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <PlayIcon /> YouTube channel
          </a>
          {SITE.social
            .filter((s) => s.label !== "YouTube")
            .map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                {s.label}
              </a>
            ))}
        </div>

        <h2 id="contact" className="scroll-mt-24">
          Contact us
        </h2>
        <p>Have a question, a story, or a note of encouragement? We would love to hear from you. For prayer requests, please use the Submit a Prayer page.</p>
      </div>
      <div className="mx-auto max-w-3xl px-4">
        <ContactForm />
      </div>
    </>
  );
}
