"use client";

import { useState } from "react";
import { LIMITS } from "@/lib/constants";
import { postJson } from "./client-utils";
import { Honeypot, Turnstile } from "./Turnstile";

export function TestimonyForm() {
  const [name, setName] = useState("");
  const [prayedFor, setPrayedFor] = useState("");
  const [answer, setAnswer] = useState("");
  const [prayerLink, setPrayerLink] = useState("");
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (prayedFor.trim().length < 3 || answer.trim().length < 3) {
      setError("Please fill in what you prayed for and how God answered.");
      return;
    }
    setBusy(true);
    const res = await postJson("/api/testimonies", { name, prayedFor, answer, prayerLink, website, turnstileToken: token });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      setResetKey((k) => k + 1);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="card" role="status">
        <p className="eyebrow">Praise God</p>
        <h3 className="mt-2 text-2xl">Thank you for giving thanks.</h3>
        <p className="mt-3">
          Your testimony was received. After a quick review it will appear below, where it will encourage everyone who is still
          waiting on God.
        </p>
        <button
          type="button"
          className="btn-secondary mt-5"
          onClick={() => {
            setDone(false);
            setPrayedFor("");
            setAnswer("");
            setPrayerLink("");
            setResetKey((k) => k + 1);
          }}
        >
          Share another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card relative space-y-6" noValidate>
      <div>
        <label htmlFor="t-name" className="field-label">
          Your first name
        </label>
        <input
          id="t-name"
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={LIMITS.name}
          autoComplete="given-name"
          placeholder="Anonymous"
        />
        <p className="mt-2 text-base text-muted">Leave this blank to stay Anonymous.</p>
      </div>
      <div>
        <label htmlFor="t-for" className="field-label">
          What did you pray for?
        </label>
        <input
          id="t-for"
          className="field"
          value={prayedFor}
          onChange={(e) => setPrayedFor(e.target.value)}
          maxLength={LIMITS.prayedFor}
          required
          placeholder="For example: my mother's surgery"
        />
      </div>
      <div>
        <label htmlFor="t-answer" className="field-label">
          How did God answer?
        </label>
        <textarea
          id="t-answer"
          className="field min-h-40 leading-relaxed"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          maxLength={LIMITS.answer}
          required
          placeholder="Tell us what happened."
        />
        <p className="mt-2 text-base text-muted">{LIMITS.answer - answer.length} characters left</p>
      </div>
      <div>
        <label htmlFor="t-link" className="field-label">
          Link to your original request <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="t-link"
          className="field"
          value={prayerLink}
          onChange={(e) => setPrayerLink(e.target.value)}
          inputMode="url"
          placeholder="Paste the prayer wall link"
        />
        <p className="mt-2 text-base text-muted">If you posted on our prayer wall, paste that link so people can see the whole story.</p>
      </div>

      <Honeypot value={website} onChange={setWebsite} />
      <Turnstile onToken={setToken} resetKey={resetKey} />

      {error && (
        <p role="alert" className="rounded-xl border border-accent/60 bg-surface-2 p-4 font-medium">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-primary w-full text-lg">
        {busy ? "Sending..." : "Share my testimony"}
      </button>
    </form>
  );
}
