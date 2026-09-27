"use client";

import { useState } from "react";
import { postJson } from "./client-utils";
import { Honeypot, Turnstile, turnstileEnabled } from "./Turnstile";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [showCheck, setShowCheck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (turnstileEnabled && !token) {
      setShowCheck(true);
      setError("One quick check below, then tap the button again.");
      return;
    }
    setBusy(true);
    const res = await postJson("/api/subscribe", { email, website, turnstileToken: token });
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
      <p role="status" className="rounded-xl border border-accent/50 p-4">
        You are in. Check your inbox for the guide, or <a href="/guide" className="font-semibold text-accent-ink underline">open it now</a>.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="relative" noValidate>
      <label htmlFor="nl-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="nl-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="Your email"
          className="field sm:flex-1"
          value={email}
          onFocus={() => setShowCheck(true)}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? "Sending..." : "Send me the guide"}
        </button>
      </div>
      <Honeypot value={website} onChange={setWebsite} />
      {showCheck && (
        <div className="mt-3">
          <Turnstile onToken={setToken} resetKey={resetKey} />
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 text-base font-medium text-accent-ink">
          {error}
        </p>
      )}
    </form>
  );
}
