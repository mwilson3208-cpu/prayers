import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrayerCard } from "@/components/PrayerCard";
import { Scripture } from "@/components/Scripture";
import { SCRIPTURE } from "@/lib/content";
import { clip, prayerTitle } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { getStore } from "@/lib/store";
import { isUuid } from "@/lib/validate";

export const revalidate = 60;

async function load(id: string) {
  if (!isUuid(id)) return null;
  return getStore().getPrayer(id);
}

export async function generateMetadata({ params }: PageProps<"/prayer-wall/[id]">): Promise<Metadata> {
  const prayer = await load((await params).id).catch(() => null);
  if (!prayer) return { title: "Prayer request", robots: { index: false } };
  return pageMetadata({
    title: prayerTitle(prayer.name, prayer.request),
    description: clip(prayer.request, 155),
    path: `/prayer-wall/${prayer.id}`,
    shareTitle: `Will you pray for ${prayer.name === "Anonymous" ? "this request" : prayer.name}?`,
    image: false, // this route has its own opengraph-image
  });
}

export default async function PrayerPage({ params }: PageProps<"/prayer-wall/[id]">) {
  const prayer = await load((await params).id);
  if (!prayer) notFound();
  return (
    <div className="glow">
      <div className="mx-auto max-w-2xl px-4 pt-10 sm:pt-16">
        <p className="eyebrow">Prayer request</p>
        <h1 className="mt-2 mb-8 text-4xl">Will you pray?</h1>
        <PrayerCard prayer={prayer} />
        <Scripture verse={SCRIPTURE.pageAnchors.prayerWall[0]} className="mt-10" size="sm" />
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/prayer-wall" className="btn-secondary">
            See more requests
          </Link>
          <Link href="/submit" className="btn-secondary">
            Submit your own
          </Link>
        </div>
      </div>
    </div>
  );
}
