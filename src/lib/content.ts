import scripture from "@content/scripture.json";
import site from "@content/site.json";
import guide from "@content/guide.json";
import faq from "@content/faq.json";
import prayers from "@content/prayers.json";
import howToPray from "@content/how-to-pray.json";

export type Verse = { reference: string; text: string };
/** A topic-page verse: World English Bible text plus a one-sentence explanation. */
export type NeedVerse = Verse & { note: string };
export type Need = {
  id: string;
  title: string;
  /** Page heading and search phrase, e.g. "Bible Verses for Anxiety". */
  heading: string;
  /** Shorter search title when "heading | Closer to the Father" would pass 60 characters. */
  metaTitle?: string;
  /** Lowercase topic used inside sentences, e.g. "anxiety". */
  keyword: string;
  /** Submit-form category that fits this need. */
  prayerCategory: string;
  intro: string;
  /** Translation code shown next to each verse, e.g. "WEB". */
  translation: string;
  /** 40 to 60 word answer to "What does the Bible say about <keyword>?", shown under the H1. */
  directAnswer: string;
  versesQuestion: string;
  versesIntro: string;
  verses: NeedVerse[];
  /** Question-style sections, shown as H2s and used for FAQPage structured data. */
  questions: { q: string; a: string }[];
  prayer: string;
  /** Ids of 2 or 3 related topics linked at the end of the page. */
  related: string[];
};

export const SCRIPTURE = scripture as {
  translation: string;
  copyrightNotice: string;
  pageAnchors: Record<"home" | "submit" | "prayerWall" | "answered" | "scripture" | "about" | "watch" | "guide", Verse[]>;
  confirmation: Verse[];
  daily: Verse[];
  needs: Need[];
  needsTranslation: { code: string; name: string; notice: string };
  firstTimePrayer: {
    title: string;
    intro: string;
    steps: string[];
    salvationIntro: string;
    salvationPrayer: string;
    afterPrayer: string;
  };
};

export const SITE = site;
export const GUIDE = guide;

export type PrayerTopic = {
  id: string;
  draft?: boolean;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  directAnswer: string;
  intro: string;
  prayers: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  /** Id of the matching /scripture topic. */
  scripture: string;
  related: { href: string; label: string }[];
};

/** Written prayers for /prayer/[topic] (content/prayers.json). */
export const PRAYER_TOPICS: PrayerTopic[] = prayers.topics;
export const getPrayerTopic = (id: string) => PRAYER_TOPICS.find((t) => t.id === id);

/** The /how-to-pray page (content/how-to-pray.json); steps come from SCRIPTURE.firstTimePrayer. */
export const HOW_TO_PRAY = howToPray as {
  metaTitle: string;
  description: string;
  directAnswer: string;
  stepNames: string[];
  faq: { q: string; a: string }[];
};

/** Founder details (content/site.json). Empty bio, photo or links are simply not shown. */
export const FOUNDER = site.founder as { name: string; jobTitle: string; bio: string; photo: string; links: { label: string; url: string }[] };
export const FAQ: { q: string; a: string }[] = faq.questions;

/** The featured video, or null until its title and upload date are filled in. */
export function featuredVideo() {
  const v = SITE.featuredVideo;
  return v.id && v.title.trim() && /^\d{4}-\d{2}-\d{2}$/.test(v.uploadDate) ? v : null;
}

/** Same verse for everyone on a given (UTC) day, cycling through the list. */
export function verseOfTheDay(date = new Date()): Verse {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86_400_000);
  const list = SCRIPTURE.daily;
  return list[(date.getUTCFullYear() * 366 + dayOfYear) % list.length];
}

export function youtubeLinks() {
  const yt = SITE.youtube;
  const channel = yt.channelUrl;
  const uploadsPlaylistId = "UU" + yt.channelId.slice(2);
  return {
    channel,
    subscribe: `${channel}?sub_confirmation=1`,
    playlists: `${channel}/playlists`,
    uploadsPlaylistId,
    startHere: yt.startHereVideoId ? `https://www.youtube.com/watch?v=${yt.startHereVideoId}` : channel,
    firstPrayer: yt.firstPrayerVideoId ? `https://www.youtube.com/watch?v=${yt.firstPrayerVideoId}` : channel,
    morning: yt.morningPlaylistId ? `https://www.youtube.com/playlist?list=${yt.morningPlaylistId}` : `${channel}/playlists`,
    night: yt.nightPlaylistId ? `https://www.youtube.com/playlist?list=${yt.nightPlaylistId}` : `${channel}/playlists`,
  };
}

export function getNeed(id: string): Need | undefined {
  return SCRIPTURE.needs.find((n) => n.id === id);
}
