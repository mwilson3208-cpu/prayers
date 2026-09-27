"use client";

import { useState } from "react";
import { LIMITS } from "@/lib/constants";
import { postJson } from "./client-utils";
import { Honeypot, Turnstile } from "./Turnstile";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await postJson("/api/contact", { name, email, message, website, turnstileToken: token });
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
        <h3 className="text-2xl">Message sent.</h3>
        <p className="mt-3">Thank you for reaching out. We read every message and will reply as soon as we can.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card relative space-y-6" noValidate>
      <div>
        <label htmlFor="c-name" className="field-label">
          Your name
        </label>
        <input id="c-name" className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.contactName} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="c-email" className="field-label">
          Your email
        </label>
        <input
          id="c-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="mt-2 text-base text-muted">So we can write back. We never share it.</p>
      </div>
      <div>
        <label htmlFor="c-message" className="field-label">
          Message
        </label>
        <textarea
          id="c-message"
          required
          className="field min-h-40 leading-relaxed"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={LIMITS.contactMessage}
        />
      </div>
      <Honeypot value={website} onChange={setWebsite} />
      <Turnstile onToken={setToken} resetKey={resetKey} />
      {error && (
        <p role="alert" className="rounded-xl border border-accent/60 bg-surface-2 p-4 font-medium">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-primary w-full text-lg">
        {busy ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
