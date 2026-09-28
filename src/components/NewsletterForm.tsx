"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { postJson } from "./client-utils";
import { Honeypot, Turnstile, turnstileEnabled } from "./Turnstile";

/** Email sign-up for the 7-Day Prayer Guide. On success, goes to the download page. */
export function NewsletterForm({ source = "footer", size = "md" }: { source?: "footer" | "guide"; size?: "md" | "lg" }) {
  const router = useRouter();
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [showCheck, setShowCheck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (turnstileEnabled && !token) {
      setShowCheck(true);
      setError("One quick check below, then tap the button again.");
      return;
    }
    setBusy(true);
    const res = await postJson("/api/subscribe", { email, website, source, turnstileToken: token });
    if (!res.ok) {
      setBusy(false);
      setError(res.error);
      setResetKey((k) => k + 1);
      return;
    }
    router.push("/guide/thank-you");
  }

  return (
    <form onSubmit={submit} className="relative" noValidate>
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="Your email"
          className={`field sm:flex-1 ${size === "lg" ? "min-h-14 text-xl" : ""}`}
          value={email}
          onFocus={() => setShowCheck(true)}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={busy} className={`btn-primary ${size === "lg" ? "min-h-14 text-lg" : ""}`}>
          {busy ? "Sending..." : "Get the free guide"}
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
