"use client";

import Link from "next/link";
import { formatDate } from "@/lib/format";
import { SITE_URL } from "@/lib/site-url";
import type { PublicTestimony } from "@/lib/types";
import { ReactionButton } from "./ReactionButton";
import { ShareButtons } from "./ShareButtons";

export function TestimonyCard({ t }: { t: PublicTestimony }) {
  return (
    <article className="card">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="font-serif text-xl">{t.name}</h3>
        <p className="text-sm text-muted">
          <time dateTime={t.createdAt}>{formatDate(t.createdAt)}</time>
        </p>
      </header>
      <p className="mt-3 text-base text-muted">
        <span className="font-semibold text-fg">Prayed for:</span> {t.prayedFor}
      </p>
      <p className="mt-3 whitespace-pre-line">{t.answer}</p>
      {t.prayerId && (
        <p className="mt-3">
          <Link href={`/prayer-wall/${t.prayerId}`} className="text-base text-accent-ink underline underline-offset-4">
            See the original prayer request
          </Link>
        </p>
      )}
      <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4">
        <ReactionButton kind="praise" id={t.id} initialCount={t.praiseCount} />
        <ShareButtons url={`${SITE_URL}/answered`} text={`God answered prayer: ${t.prayedFor}`} />
      </div>
    </article>
  );
}
