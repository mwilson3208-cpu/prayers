"use client";

import Link from "next/link";
import { formatDate } from "@/lib/format";
import { templatePrayer } from "@/lib/prayer-template";
import { SITE_URL } from "@/lib/site-url";
import type { PublicPrayer } from "@/lib/types";
import { ReactionButton } from "./ReactionButton";
import { ShareButtons } from "./ShareButtons";

export function PrayerCard({ prayer, headingLevel = "h2" }: { prayer: PublicPrayer; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const shareUrl = `${SITE_URL}/prayer-wall/${prayer.id}`;
  return (
    <article className="card">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <H className="font-serif text-xl">{prayer.name}</H>
        <p className="text-sm text-muted">
          <Link href={`/prayer-wall/${prayer.id}`} className="hover:underline">
            <time dateTime={prayer.createdAt}>{formatDate(prayer.createdAt)}</time>
          </Link>
        </p>
      </header>
      {prayer.category && (
        <p className="mt-2">
          <span className="inline-block rounded-full border border-accent/40 px-3 py-0.5 text-sm text-accent-ink">{prayer.category}</span>
        </p>
      )}
      <p className="mt-4 whitespace-pre-line">{prayer.request}</p>

      <details className="mt-4 rounded-xl bg-bg/60 px-4 py-3">
        <summary className="cursor-pointer font-semibold text-accent-ink">Pray a prayer over this request</summary>
        <p className="mt-3 font-serif text-lg italic leading-relaxed">{templatePrayer(prayer.name, prayer.category)}</p>
        <p className="mt-2 text-sm text-muted">Read it aloud slowly, or use your own words.</p>
      </details>

      <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4">
        <ReactionButton kind="prayed" id={prayer.id} initialCount={prayer.prayedCount} />
        <ShareButtons url={shareUrl} text={`Will you pray for ${prayer.name === "Anonymous" ? "this request" : prayer.name}?`} />
      </div>
    </article>
  );
}
