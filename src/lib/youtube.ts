import "server-only";
import { SITE } from "./content";

export type LatestVideo = { id: string; title: string } | null;

/**
 * Reads the channel's public RSS feed (no API key needed) to find the
 * newest upload. Cached for an hour. Returns null if YouTube is unreachable,
 * and the page falls back to the channel's uploads playlist.
 */
export async function getLatestVideo(): Promise<LatestVideo> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${SITE.youtube.channelId}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    const xml = await res.text();
    const entry = xml.split("<entry>")[1];
    if (!entry) return null;
    const id = entry.match(/<yt:videoId>([\w-]{6,20})<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title>([^<]*)<\/title>/)?.[1] ?? "Latest video";
    return id ? { id, title: decodeXml(title) } : null;
  } catch {
    return null;
  }
}

function decodeXml(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
