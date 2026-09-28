import type { Metadata } from "next";
import Link from "next/link";
import { Scripture } from "@/components/Scripture";
import { YouTube } from "@/components/YouTube";
import { CandleIcon, HandsIcon, HeartIcon, LogoMark, MoonIcon, PlayIcon, SunIcon } from "@/components/icons";
import { SCRIPTURE, SITE, verseOfTheDay, youtubeLinks } from "@/lib/content";
import { formatNumber } from "@/lib/format";
import { safe } from "@/lib/safe";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { getStore } from "@/lib/store";
import { getLatestVideo } from "@/lib/youtube";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: `${SITE.name} | Free Prayer Requests and Prayer Wall`,
  description: SITE.description,
  path: "/",
});

export default async function HomePage() {
  const store = getStore();
  const [stats, latest, recent] = await Promise.all([
    safe(() => store.getStats(), { prayersSubmitted: 0, prayersPrayed: 0, answered: 0 }, "home stats"),
    getLatestVideo(),
    safe(() => store.listPrayers({ limit: 3 }), { items: [], nextCursor: null }, "home recent"),
  ]);
  const yt = youtubeLinks();
  const today = verseOfTheDay();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE.name,
        url: SITE_URL,
        logo: `${SITE_URL}/icons/icon-512.png`,
        description: SITE.description,
        sameAs: Array.from(new Set([yt.channel, ...SITE.social.map((s) => s.url)])),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE.name,
        url: SITE_URL,
        description: SITE.description,
        inLanguage: "en-US",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      {/* Hero */}
      <section className="glow">
        <div className="mx-auto max-w-3xl px-4 pt-12 pb-14 text-center sm:pt-20 sm:pb-20">
          <LogoMark width={56} height={56} className="mx-auto text-accent" />
          <h1 className="mt-5 text-4xl sm:text-6xl">{SITE.name}</h1>
          <p className="mt-4 font-serif text-xl text-accent-ink italic sm:text-2xl">{SITE.tagline}</p>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{SITE.mission}</p>
          <div className="mx-auto mt-8 grid max-w-md gap-3 sm:max-w-none sm:grid-cols-3">
            <Link href="/submit" className="btn-primary text-lg">
              <CandleIcon /> Submit a Prayer
            </Link>
            <Link href="/prayer-wall" className="btn-secondary text-lg">
              <HandsIcon /> Pray for Others
            </Link>
            <Link href="/answered" className="btn-secondary text-lg">
              <HeartIcon /> Give Thanks
            </Link>
          </div>
          <div className="mx-auto mt-12 max-w-lg text-left">
            <Scripture verse={SCRIPTURE.pageAnchors.home[0]} size="lg" />
          </div>
        </div>
      </section>

      {/* Counters */}
      <section aria-label="Prayer community so far" className="mx-auto max-w-5xl px-4">
        <dl className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            ["Prayers submitted", stats.prayersSubmitted],
            ["Times someone prayed", stats.prayersPrayed],
            ["Answered prayers", stats.answered],
          ].map(([label, value]) => (
            <div key={label as string} className="flex flex-col-reverse rounded-2xl border border-line bg-surface px-2 py-4 text-center sm:p-6">
              <dt className="mt-1 text-sm leading-snug text-muted sm:text-base">{label}</dt>
              <dd className="font-serif text-3xl text-accent-ink sm:text-5xl">{formatNumber(value as number)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Latest video */}
      <section aria-labelledby="latest-heading" className="mx-auto mt-16 max-w-4xl px-4">
        <p className="eyebrow">Pray along</p>
        <h2 id="latest-heading" className="mt-2 text-3xl">
          Latest from the channel
        </h2>
        <div className="mt-6">
          {latest ? (
            <YouTube videoId={latest.id} title={latest.title} />
          ) : (
            <YouTube playlistId={yt.uploadsPlaylistId} title="Latest guided prayer" />
          )}
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a href={yt.channel} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <PlayIcon /> Watch on YouTube
          </a>
          <a href={yt.subscribe} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Subscribe for daily prayer
          </a>
        </div>
      </section>

      {/* Scripture of the day */}
      <section aria-labelledby="votd-heading" className="mx-auto mt-16 max-w-3xl px-4">
        <div className="card glow py-8 sm:px-10">
          <p id="votd-heading" className="eyebrow">
            Scripture of the day
          </p>
          <Scripture verse={today} size="lg" className="mt-4" />
          <p className="mt-6 text-base text-muted">
            Read it slowly twice. Then tell God one thing it stirs in you.{" "}
            <Link href="/scripture" className="text-accent-ink underline underline-offset-4">
              Find Scripture for what you are facing
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Pray with us daily */}
      <section aria-labelledby="daily-heading" className="mx-auto mt-16 max-w-5xl px-4">
        <p className="eyebrow">Seven minutes a day</p>
        <h2 id="daily-heading" className="mt-2 text-3xl">
          Pray with us daily
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a href={yt.morning} target="_blank" rel="noopener noreferrer" className="card group block hover:border-accent/60">
            <SunIcon className="text-accent" width={32} height={32} />
            <h3 className="mt-3 text-2xl">Morning Prayers</h3>
            <p className="mt-2 text-muted">Start the day with God before the noise begins. Guided, short, and Scripture-first.</p>
            <p className="mt-4 font-semibold text-accent-ink group-hover:underline">Open the playlist</p>
          </a>
          <a href={yt.night} target="_blank" rel="noopener noreferrer" className="card group block hover:border-accent/60">
            <MoonIcon className="text-accent" width={32} height={32} />
            <h3 className="mt-3 text-2xl">Night Prayers</h3>
            <p className="mt-2 text-muted">Lay down the day, release your worries, and rest in His peace before sleep.</p>
            <p className="mt-4 font-semibold text-accent-ink group-hover:underline">Open the playlist</p>
          </a>
        </div>
      </section>

      {/* Recent requests */}
      {recent.items.length > 0 && (
        <section aria-labelledby="recent-heading" className="mx-auto mt-16 max-w-3xl px-4">
          <p className="eyebrow">Bear one another&apos;s burdens</p>
          <h2 id="recent-heading" className="mt-2 text-3xl">
            People asking for prayer right now
          </h2>
          <ul className="mt-6 space-y-4">
            {recent.items.map((p) => (
              <li key={p.id}>
                <Link href={`/prayer-wall/${p.id}`} className="card block hover:border-accent/60">
                  <p className="font-serif text-lg">{p.name}</p>
                  <p className="mt-2 line-clamp-3 text-muted">{p.request}</p>
                  <p className="mt-3 text-base font-semibold text-accent-ink">Pray for {p.name === "Anonymous" ? "this request" : p.name}</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-center">
            <Link href="/prayer-wall" className="btn-primary">
              See the whole prayer wall
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
