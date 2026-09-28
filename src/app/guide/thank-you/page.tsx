import type { Metadata } from "next";
import Link from "next/link";
import { Scripture } from "@/components/Scripture";
import { PlayIcon } from "@/components/icons";
import { GUIDE, youtubeLinks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Thank you: your prayer guide is ready",
  robots: { index: false, follow: false },
};

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12M7.5 10.5 12 15l4.5-4.5" />
      <path d="M5 19h14" />
    </svg>
  );
}

export default function GuideThankYouPage() {
  const yt = youtubeLinks();
  return (
    <div className="glow">
      <div className="mx-auto max-w-2xl px-4 pt-12 sm:pt-20">
        <p className="eyebrow text-center">Thank you</p>
        <h1 className="mt-3 text-center text-4xl sm:text-5xl">Your prayer guide is ready</h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-lg text-muted">
          Tap the button to download <span className="text-fg">{GUIDE.title}</span>. Save it to your phone so it is ready each morning.
        </p>

        <div className="mt-8 text-center">
          <a href={GUIDE.file} download className="btn-primary min-h-14 w-full px-8 text-lg sm:w-auto">
            <DownloadIcon /> Download the 7-Day Prayer Guide
          </a>
          <p className="mt-3 text-sm text-muted">{GUIDE.fileDescription}</p>
        </div>

        <section aria-labelledby="yt-heading" className="card mt-12 text-center sm:p-8">
          <h2 id="yt-heading" className="text-2xl sm:text-3xl">
            Pray with us every day
          </h2>
          <p className="mt-3 text-muted">
            A guided morning prayer and night prayer are waiting for you on our YouTube channel. Press play and pray along.
          </p>
          <a href={yt.channel} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 w-full text-lg sm:w-auto">
            <PlayIcon /> Visit our YouTube channel
          </a>
        </section>

        <Scripture verse={{ reference: "James 4:8a", text: "Draw near to God, and he will draw near to you." }} className="mx-auto mt-12 max-w-md" size="sm" />

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/prayer-wall" className="btn-secondary">
            Pray for someone today
          </Link>
          <Link href="/submit" className="btn-secondary">
            Share a prayer request
          </Link>
        </div>
      </div>
    </div>
  );
}
