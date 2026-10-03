import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { SCRIPTURE, getNeed } from "@/lib/content";
import { clip, nestQuotes } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

export const dynamicParams = false;

export function generateStaticParams() {
  return SCRIPTURE.needs.map((n) => ({ need: n.id }));
}

export async function generateMetadata({ params }: PageProps<"/scripture/[need]">): Promise<Metadata> {
  const need = getNeed((await params).need);
  if (!need) return {};
  const count = need.verses.length;
  return pageMetadata({
    // The layout adds " | Closer to the Father"; metaTitle keeps long topics under 60 characters.
    title: need.metaTitle ?? need.heading,
    description: clip(`${count} ${need.heading.replace(/^Bible Verses/, "Bible verses")}, each with a simple way to pray it. ${need.intro}`, 158),
    path: `/scripture/${need.id}`,
  });
}

export default async function NeedPage({ params }: PageProps<"/scripture/[need]">) {
  const need = getNeed((await params).need);
  if (!need) notFound();
  const others = SCRIPTURE.needs.filter((n) => n.id !== need.id);
  const url = `${SITE_URL}/scripture/${need.id}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: need.heading,
          url,
          numberOfItems: need.verses.length,
          itemListElement: need.verses.map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: v.reference,
            url: `${url}#verse-${i + 1}`,
          })),
        }}
      />
      <header className="glow">
        <div className="mx-auto max-w-3xl px-4 pt-8 pb-8 sm:pt-12">
          <Breadcrumbs
            items={[
              { name: "Scripture", path: "/scripture" },
              { name: need.title, path: `/scripture/${need.id}` },
            ]}
          />
          <p className="eyebrow mt-8">Scripture to pray</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">{need.heading}</h1>
          <p className="mt-4 text-lg text-muted sm:text-xl">{need.intro}</p>
          <p className="mt-4 text-muted">
            Below are {need.verses.length} verses for {need.keyword}. Read each one slowly, then use the short note under it to
            turn the verse into a prayer. You do not need special words. Just be honest with God.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4">
        <ol className="space-y-5">
          {need.verses.map((v, i) => (
            <li key={v.reference} id={`verse-${i + 1}`} className="card scroll-mt-24">
              <h2 className="text-xl text-accent-ink">{v.reference}</h2>
              <p className="mt-3 font-serif text-xl leading-snug italic">&ldquo;{nestQuotes(v.text)}&rdquo;</p>
              <p className="mt-4 border-t border-line pt-3">
                <span className="font-semibold">How to pray it: </span>
                {v.howToPray}
              </p>
            </li>
          ))}
        </ol>

        <section aria-labelledby="pray-with-us" className="card glow mt-12 border-accent/50 sm:p-8">
          <h2 id="pray-with-us" className="text-2xl sm:text-3xl">
            You do not have to carry this alone
          </h2>
          <p className="mt-3 text-muted">
            Share what you are facing when you{" "}
            <Link href="/submit" className="text-accent-ink underline underline-offset-4">
              submit a prayer request
            </Link>
            , and real people will pray for you. Keep it private or post it on the{" "}
            <Link href="/prayer-wall" className="text-accent-ink underline underline-offset-4">
              prayer wall
            </Link>
            .
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={`/submit?category=${encodeURIComponent(need.prayerCategory)}`} className="btn-primary">
              Ask for prayer
            </Link>
            <Link href="/7days" className="btn-secondary">
              Get the free 7-Day Prayer Guide
            </Link>
          </div>
        </section>

        <section aria-labelledby="more-verses" className="mt-14">
          <h2 id="more-verses" className="text-2xl">
            More Scripture for what you are facing
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {others.map((n) => (
              <li key={n.id}>
                <Link href={`/scripture/${n.id}`} className="card block py-4 hover:border-accent/60">
                  <span className="font-serif text-lg">{n.heading}</span>
                  <span className="mt-1 block text-sm text-muted">{n.verses.length} verses with prayers</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link href="/scripture#first-prayer" className="text-accent-ink underline underline-offset-4">
              Never prayed before? Start here.
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
