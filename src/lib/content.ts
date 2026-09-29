import scripture from "@content/scripture.json";
import site from "@content/site.json";
import guide from "@content/guide.json";

export type Verse = { reference: string; text: string };
export type NeedVerse = Verse & { howToPray: string };
export type Need = {
  id: string;
  title: string;
  /** Page heading and search phrase, e.g. "Bible Verses for Anxiety". */
  heading: string;
  /** Lowercase topic used inside sentences, e.g. "anxiety". */
  keyword: string;
  /** Submit-form category that fits this need. */
  prayerCategory: string;
  intro: string;
  verses: NeedVerse[];
};

export const SCRIPTURE = scripture as {
  translation: string;
  copyrightNotice: string;
  pageAnchors: Record<"home" | "submit" | "prayerWall" | "answered" | "scripture" | "about" | "watch" | "guide", Verse[]>;
  confirmation: Verse[];
  daily: Verse[];
  needs: Need[];
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
