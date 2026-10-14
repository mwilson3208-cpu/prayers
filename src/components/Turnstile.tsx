"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
    __turnstileLoading?: Promise<void>;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
export const turnstileEnabled = Boolean(SITE_KEY);

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  window.__turnstileLoading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(s);
  });
  return window.__turnstileLoading;
}

/**
 * Cloudflare Turnstile human check. Renders nothing when no site key is set.
 * Change `resetKey` to get a fresh token after a failed submit.
 */
export function Turnstile({ onToken, resetKey = 0 }: { onToken: (token: string) => void; resetKey?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const cb = useRef(onToken);
  cb.current = onToken;

  useEffect(() => {
    const el = ref.current;
    if (!SITE_KEY || !el) return;
    let cancelled = false;
    // Load Cloudflare's script only when the form is near the screen. The footer
    // sign-up form is on every page, and most visitors never scroll to it.
    const start = () =>
      loadScript()
        .then(() => {
          if (cancelled || !ref.current || !window.turnstile) return;
          widgetId.current = window.turnstile.render(ref.current, {
            sitekey: SITE_KEY,
            theme: document.documentElement.dataset.theme === "light" ? "light" : "dark",
            size: "flexible",
            callback: (t: string) => cb.current(t),
            "expired-callback": () => cb.current(""),
            "error-callback": () => cb.current(""),
          });
        })
        .catch(() => {});
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey && widgetId.current && window.turnstile) {
      cb.current("");
      window.turnstile.reset(widgetId.current);
    }
  }, [resetKey]);

  if (!SITE_KEY) return null;
  return <div ref={ref} className="min-h-[65px]" />;
}

/** Hidden field that only bots fill in. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} name="website" />
      </label>
    </div>
  );
}
