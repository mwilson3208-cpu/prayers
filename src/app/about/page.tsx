import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { BreadcrumbJsonLd, JsonLd, ORG_ID, founderLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/Scripture";
import { PlayIcon } from "@/components/icons";
import Image from "next/image";
import { FOUNDER, SCRIPTURE, SITE, youtubeLinks } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "About Our Prayer Ministry",
  description: "Why Closer to the Father exists, who runs this free prayer ministry, what we believe about Jesus and the Bible, and how to reach our prayer team.",
  path: "/about",
});

export default function AboutPage() {
  const yt = youtubeLinks();
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "About", path: "/about" }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              "@id": `${SITE_URL}/about#page`,
              url: `${SITE_URL}/about`,
              name: `About ${SITE.name}`,
              description: SITE.mission,
              inLanguage: "en-US",
              about: { "@id": ORG_ID },
              mainEntity: { "@id": ORG_ID },
            },
            founderLd(),
          ],
        }}
      />
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

        <h2 id="founder" className="scroll-mt-24">
          Who runs it
        </h2>
        {FOUNDER.photo && (
          <Image
            src={FOUNDER.photo}
            alt={`${FOUNDER.name}, ${FOUNDER.jobTitle.toLowerCase()} of ${SITE.name}`}
            width={160}
            height={160}
            className="float-right ml-5 mb-3 h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40"
          />
        )}
        <p>
          {SITE.name} was founded by <strong>{FOUNDER.name}</strong>. {FOUNDER.bio}
        </p>
        <p>{SITE.about.whoRunsIt}</p>
        {FOUNDER.links.length > 0 && (
          <p>
            Find {FOUNDER.name.split(" ")[0]} online:{" "}
            {FOUNDER.links.map((l, i) => (
              <span key={l.url}>
                {i > 0 && ", "}
                <a href={l.url} target="_blank" rel="noopener noreferrer me" className="text-accent-ink underline underline-offset-4">
                  {l.label}
                </a>
              </span>
            ))}
          </p>
        )}
        <p>
          To reach {FOUNDER.name.split(" ")[0]} and the prayer team, use the{" "}
          <a href="#contact" className="text-accent-ink underline underline-offset-4">
            contact form
          </a>{" "}
          below.
        </p>

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
