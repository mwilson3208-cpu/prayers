import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrayerCard } from "@/components/PrayerCard";
import { Scripture } from "@/components/Scripture";
import { SCRIPTURE } from "@/lib/content";
import { getStore } from "@/lib/store";
import { isUuid } from "@/lib/validate";

export const revalidate = 60;

async function load(id: string) {
  if (!isUuid(id)) return null;
  return getStore().getPrayer(id);
}

export async function generateMetadata({ params }: PageProps<"/prayer-wall/[id]">): Promise<Metadata> {
  const prayer = await load((await params).id).catch(() => null);
  if (!prayer) return { title: "Prayer request" };
  const who = prayer.name === "Anonymous" ? "someone" : prayer.name;
  const excerpt = prayer.request.length > 150 ? `${prayer.request.slice(0, 147)}...` : prayer.request;
  return {
    title: `Pray for ${who}`,
    description: excerpt,
    alternates: { canonical: `/prayer-wall/${prayer.id}` },
    openGraph: { title: `Will you pray for ${who}?`, description: excerpt, url: `/prayer-wall/${prayer.id}` },
  };
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
