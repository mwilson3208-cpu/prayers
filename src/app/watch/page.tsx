import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/Scripture";
import { BreadcrumbJsonLd, FeaturedVideoJsonLd } from "@/components/JsonLd";
import { YouTube } from "@/components/YouTube";
import { MoonIcon, PlayIcon, SunIcon } from "@/components/icons";
import { SCRIPTURE, featuredVideo, youtubeLinks } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Guided Prayers and Daily Devotionals",
  description: "Guided prayers and short daily devotionals from the Closer to the Father YouTube channel. Seven minutes a day, one step closer to Him.",
  path: "/watch",
});

export default function WatchPage() {
  const yt = youtubeLinks();
  const featured = featuredVideo();
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Watch", path: "/watch" }]} />
      <FeaturedVideoJsonLd />
      <PageHeader
        eyebrow="Seven minutes a day"
        title="Watch and Pray"
        lead="Every video is a guided prayer or short devotional. Press play, close your eyes when you are ready, and pray along."
        verses={SCRIPTURE.pageAnchors.watch}
      />
      <div className="mx-auto max-w-4xl px-4">
        {featured && (
          <div className="mb-6">
            <YouTube videoId={featured.id} title={featured.title} thumbnailAlt={featured.thumbnailAlt} />
          </div>
        )}
        <YouTube playlistId={yt.uploadsPlaylistId} title="All guided prayers, newest first" />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={yt.subscribe} target="_blank" rel="noopener noreferrer" className="btn-primary text-lg">
            <PlayIcon /> Subscribe on YouTube
          </a>
          <a href={yt.channel} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Open the channel
          </a>
        </div>

        <section aria-labelledby="what-to-expect" className="mt-16">
          <h2 id="what-to-expect" className="text-3xl">
            What you will find on the channel
          </h2>
          <p className="mt-4 text-lg text-muted">
            Closer to the Father is a guided prayer and daily devotional channel. Every video is built to help you spend a few
            honest minutes with God, even on your busiest day. You do not need to know what to say. Press play, and we will pray
            through it together.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Guided prayers", "Short prayers you can pray along with, word for word, for peace, healing, strength, and more."],
              ["Daily devotionals", "One verse and one simple thought to carry into your day. Most take about seven minutes."],
              ["Prayers for real life", "Prayers for anxiety, grief, family, finances, and the moments you do not have words for."],
            ].map(([title, text]) => (
              <li key={title} className="card">
                <h3 className="text-xl">{title}</h3>
                <p className="mt-2 text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how-to-pray-along" className="mt-16">
          <h2 id="how-to-pray-along" className="text-3xl">
            How to pray along
          </h2>
          <ol className="mt-5 list-decimal space-y-2 pl-6 text-lg">
            <li>Find a quiet spot and put your phone face down once the video starts.</li>
            <li>Read or listen to the verse, then pray each line out loud or in your heart.</li>
            <li>When the video ends, sit for one more minute and tell God what is on your mind.</li>
            <li>Come back tomorrow. Seven minutes a day adds up to a closer walk with Him.</li>
          </ol>
          <p className="mt-6 text-muted">
            Want Scripture for something specific?{" "}
            <Link href="/scripture" className="text-accent-ink underline underline-offset-4">
              Find Bible verses for what you are facing
            </Link>
            , or get the{" "}
            <Link href="/7days" className="text-accent-ink underline underline-offset-4">
              free 7-Day Prayer Guide
            </Link>
            .
          </p>
        </section>

        <h2 className="mt-16 text-3xl">Pray with us daily</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a href={yt.morning} target="_blank" rel="noopener noreferrer" className="card block hover:border-accent/60">
            <SunIcon className="text-accent" width={32} height={32} />
            <h3 className="mt-3 text-2xl">Morning Prayers</h3>
            <p className="mt-2 text-muted">Give God the first minutes of your day.</p>
          </a>
          <a href={yt.night} target="_blank" rel="noopener noreferrer" className="card block hover:border-accent/60">
            <MoonIcon className="text-accent" width={32} height={32} />
            <h3 className="mt-3 text-2xl">Night Prayers</h3>
            <p className="mt-2 text-muted">End the day in His peace.</p>
          </a>
        </div>
      </div>
    </>
  );
}
