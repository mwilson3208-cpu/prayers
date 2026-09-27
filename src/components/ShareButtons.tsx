"use client";

import { useState } from "react";
import { ShareIcon } from "./icons";

export function ShareButtons({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  async function nativeShare(e: React.MouseEvent) {
    if (typeof navigator !== "undefined" && navigator.share) {
      e.preventDefault();
      try {
        await navigator.share({ title: "Closer to the Father", text, url });
      } catch {}
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  }

  const links = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { label: "X", href: `https://x.com/intent/post?text=${enc(text)}&url=${enc(url)}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${text} ${url}`)}` },
    { label: "Email", href: `mailto:?subject=${enc("Will you pray with me?")}&body=${enc(`${text}\n\n${url}`)}` },
  ];

  return (
    <details className="group">
      <summary
        onClick={nativeShare}
        className="btn-ghost cursor-pointer list-none px-3 [&::-webkit-details-marker]:hidden"
      >
        <ShareIcon /> Share
      </summary>
      <div className="mt-2 flex flex-wrap gap-2">
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="btn-secondary min-h-11 px-4 py-2 text-sm">
            {l.label}
          </a>
        ))}
        <button type="button" onClick={copy} className="btn-secondary min-h-11 px-4 py-2 text-sm">
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
    </details>
  );
}
