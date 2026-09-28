"use client";

import { useState } from "react";
import { PlayIcon } from "./icons";

/**
 * Click-to-load YouTube player. Shows a lightweight preview first so the
 * page stays fast on phones, then loads the real player when tapped.
 */
export function YouTube({ videoId, playlistId, title }: { videoId?: string; playlistId?: string; title: string }) {
  const [active, setActive] = useState(false);
  const src = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
    : `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&autoplay=1&rel=0`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-bg-deep shadow-xl shadow-black/20">
      {active ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 flex h-full w-full items-center justify-center"
          aria-label={`Play video: ${title}`}
        >
          {videoId ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
          ) : (
            <span className="glow absolute inset-0" />
          )}
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent text-on-accent shadow-lg transition-transform group-hover:scale-105 sm:h-20 sm:w-20">
            <PlayIcon width={32} height={32} />
          </span>
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-left font-serif text-lg text-cream">
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
