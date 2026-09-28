import type { Metadata } from "next";
import { PageHeader } from "@/components/Scripture";
import { YouTube } from "@/components/YouTube";
import { MoonIcon, PlayIcon, SunIcon } from "@/components/icons";
import { SCRIPTURE, youtubeLinks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Watch Guided Prayers",
  description: "Guided prayers and daily devotionals from the Closer to the Father YouTube channel. Seven minutes a day.",
  alternates: { canonical: "/watch" },
};

export default function WatchPage() {
  const yt = youtubeLinks();
  return (
    <>
      <PageHeader
        eyebrow="Seven minutes a day"
        title="Watch and Pray"
        lead="Every video is a guided prayer or short devotional. Press play, close your eyes when you are ready, and pray along."
        verses={SCRIPTURE.pageAnchors.watch}
      />
      <div className="mx-auto max-w-4xl px-4">
        <YouTube playlistId={yt.uploadsPlaylistId} title="All guided prayers, newest first" />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={yt.subscribe} target="_blank" rel="noopener noreferrer" className="btn-primary text-lg">
            <PlayIcon /> Subscribe on YouTube
          </a>
          <a href={yt.channel} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Open the channel
          </a>
        </div>

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
