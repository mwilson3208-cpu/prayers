"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, isCategory, LIMITS } from "@/lib/constants";
import type { Verse } from "@/lib/content";
import { mentionsCrisis } from "@/lib/crisis";
import { postJson } from "./client-utils";
import { CrisisNotice } from "./CrisisNotice";
import { PlayIcon } from "./icons";
import { Scripture } from "./Scripture";
import { Honeypot, Turnstile } from "./Turnstile";

export function SubmitForm({ confirmationVerses, startHereUrl }: { confirmationVerses: Verse[]; startHereUrl: string }) {
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ crisis: boolean; isPublic: boolean; posted: boolean } | null>(null);
  const [verse, setVerse] = useState(confirmationVerses[0]);
  const topRef = useRef<HTMLDivElement>(null);

  const crisis = mentionsCrisis(request);
  const remaining = LIMITS.request - request.length;

  useEffect(() => {
    if (done) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [done]);

  // Links like /submit?category=Grief (from the Scripture pages) preselect the category.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("category");
    if (isCategory(fromUrl)) setCategory(fromUrl);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (request.trim().length < 3) {
      setError("Please share your prayer request.");
      return;
    }
    setBusy(true);
    const res = await postJson<{ crisis?: boolean; posted?: boolean }>("/api/prayers", {
      name,
      request,
      category: category || null,
      email,
      isPublic,
      website,
      turnstileToken: token,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      setResetKey((k) => k + 1);
      return;
    }
    setVerse(confirmationVerses[Math.floor(Math.random() * confirmationVerses.length)]);
    setDone({ crisis: Boolean(res.crisis) || crisis, isPublic, posted: Boolean(res.posted) });
  }

  if (done) {
    return (
      <div ref={topRef} className="scroll-mt-24 space-y-6">
        {done.crisis && <CrisisNotice />}
        <div className="card">
          <p className="eyebrow">Received</p>
          <h2 className="mt-2 text-3xl">Thank you. We are praying with you.</h2>
          <p className="mt-4">
            {!done.isPublic
              ? "Your request was sent privately to our prayer team. It will not appear on the prayer wall."
              : done.posted
                ? "Your request is on the prayer wall now, so others can pray for you too. A member of our team reads every request."
                : "Your request is safe with us. A member of our team reads every request, and once it is reviewed it will appear on the prayer wall so others can pray for you too."}
          </p>
          {email && <p className="mt-3 text-muted">We sent a confirmation to your email. You can unsubscribe any time.</p>}
          <Scripture verse={verse} className="mt-8" />
        </div>

        <div className="card">
          <h2 className="text-2xl">Never prayed before?</h2>
          <p className="mt-3">
            That is okay. Start here. This short video walks you through your first conversation with God, step by step.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a href={startHereUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <PlayIcon /> Watch &ldquo;Start Here&rdquo;
            </a>
            <Link href="/scripture#first-prayer" className="btn-secondary">
              How to pray for the first time
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/prayer-wall" className="btn-primary">
            Pray for others
          </Link>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setDone(null);
              setRequest("");
              setCategory("");
              setResetKey((k) => k + 1);
            }}
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card relative space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="field-label">
          Your first name
        </label>
        <input
          id="name"
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={LIMITS.name}
          autoComplete="given-name"
          placeholder="Anonymous"
          aria-describedby="name-help"
        />
        <p id="name-help" className="mt-2 text-base text-muted">
          Leave this blank to stay Anonymous.
        </p>
      </div>

      <div>
        <label htmlFor="request" className="field-label">
          Your prayer request
        </label>
        <textarea
          id="request"
          className="field min-h-44 leading-relaxed"
          value={request}
          onChange={(e) => setRequest(e.target.value.slice(0, LIMITS.request))}
          maxLength={LIMITS.request}
          required
          placeholder="What can we pray with you about?"
          aria-describedby="request-count"
        />
        <p id="request-count" className={`mt-2 text-base ${remaining < 50 ? "text-accent-ink" : "text-muted"}`} aria-live="polite">
          {remaining} characters left
        </p>
      </div>

      {crisis && <CrisisNotice />}

      <div>
        <label htmlFor="category" className="field-label">
          Category <span className="font-normal text-muted">(optional)</span>
        </label>
        <select id="category" className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Choose one</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Email <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-describedby="email-help"
        />
        <p id="email-help" className="mt-2 text-base text-muted">
          We will let you know when people pray for you. Your email is never shown publicly.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="mt-1 h-6 w-6 shrink-0 accent-[var(--accent)]"
        />
        <span>
          <span className="font-semibold">Share this publicly on the prayer wall</span>
          <span className="mt-1 block text-base text-muted">
            Uncheck to send it privately to our prayer team only. A member of our team reads every public request.
          </span>
        </span>
      </label>

      <Honeypot value={website} onChange={setWebsite} />
      <Turnstile onToken={setToken} resetKey={resetKey} />

      {error && (
        <p role="alert" className="rounded-xl border border-accent/60 bg-surface-2 p-4 font-medium">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-primary w-full text-lg">
        {busy ? "Sending..." : "Send my prayer request"}
      </button>

      {!crisis && <CrisisNotice compact />}
    </form>
  );
}
