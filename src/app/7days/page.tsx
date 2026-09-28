import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Scripture } from "@/components/Scripture";
import { CheckIcon } from "@/components/icons";
import { GUIDE } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free 7-Day Prayer Guide: Seven Minutes a Day",
  description:
    "Build a prayer life you can keep in seven minutes a day. Get the free 7-Day Prayer Guide: one verse, one short teaching, one guided prayer, and one simple action each day. Instant download.",
  path: "/7days",
  shareTitle: "Free 7-Day Prayer Guide: Seven minutes a day. One step closer to Him.",
  image: false, // this route has its own share image with the guide cover
});

const DAY_HOOKS = [
  "Stop trying to earn the distance back. You take one step. He takes the rest.",
  "Hand God the worry you were never built to carry, and learn how to leave it with Him.",
  "Drop the filter. Bring the real you to a Father who already knows and stayed.",
  "Understand why you can walk in at all, and how to begin a real relationship with Jesus.",
  "Prayer is not a voicemail. Learn how God speaks through His Word and in the quiet.",
  "Carry someone else's burden to God and watch what it does to your own heart.",
  "Turn seven days into a daily habit you keep for the rest of your life.",
];

const STEPS = [
  { label: "Read", text: "One verse to anchor your day in God's Word." },
  { label: "Understand", text: "A short teaching in plain words. No theology exam." },
  { label: "Pray", text: "A guided prayer you can read out loud or in your head." },
  { label: "Act", text: "One simple action to take before the day ends." },
];

const FAQ = [
  {
    q: "Is it really free?",
    a: "Yes. No cost, no catch, and no credit card. This guide exists to help you pray, not to sell you something.",
  },
  {
    q: "Do I need to know the Bible?",
    a: "No. Every day gives you the verse, explains it in simple words, and hands you a prayer to pray. If you have never prayed before, you are exactly who this was written for.",
  },
  {
    q: "What if I miss a day?",
    a: "Pick up where you left off. God is not keeping score, and neither is this guide. His mercies are new every morning.",
  },
  {
    q: "What happens after I enter my email?",
    a: "You go straight to your download page. We also email you a copy so you can find it later. You can unsubscribe with one tap at any time.",
  },
];

function CtaBox({ id }: { id: string }) {
  return (
    <div className="rounded-2xl border border-accent/50 bg-surface p-5 shadow-2xl shadow-black/30 sm:p-6">
      <p id={id} className="font-serif text-xl sm:text-2xl">
        Get your free copy now
      </p>
      <p className="mt-1 text-base text-muted">Enter your email and download it instantly.</p>
      <div className="mt-4">
        <NewsletterForm source="guide" size="lg" />
      </div>
      <p className="mt-3 text-sm text-muted">Free. {GUIDE.fileDescription}. No spam. Unsubscribe any time.</p>
    </div>
  );
}

export default function SevenDaysPage() {
  return (
    <>
      {/* Hero */}
      <section className="glow">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-14 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div>
            <Image
              src="/images/prayer-guide-cover.jpg"
              alt="Cover of 7 Days to a Closer Walk With the Father, a sunrise over a path through the hills"
              width={900}
              height={1165}
              priority
              sizes="160px"
              className="mb-6 w-36 -rotate-2 rounded-md shadow-2xl shadow-black/50 sm:w-40 lg:hidden"
            />
            <p className="eyebrow">Free 7-Day Prayer Guide</p>
            <h1 className="mt-3 text-4xl leading-tight sm:text-5xl lg:text-6xl">Build a prayer life you can actually keep.</h1>
            <p className="mt-5 text-lg text-muted sm:text-xl">
              Seven days. Seven minutes a day. One verse, one short teaching, one guided prayer, and one simple action each
              morning. No hour-long study. No pressure to get it perfect. Just a daily meeting with the Father who has been
              waiting for you.
            </p>
            <div className="mt-8">
              <CtaBox id="cta-top" />
            </div>
          </div>
          <div className="hidden lg:block">
            <Image
              src="/images/prayer-guide-cover.jpg"
              alt="Cover of 7 Days to a Closer Walk With the Father, a sunrise over a path through the hills"
              width={900}
              height={1165}
              priority
              sizes="420px"
              className="mx-auto w-full max-w-md -rotate-2 rounded-lg shadow-2xl shadow-black/50"
            />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section aria-labelledby="problem" className="mx-auto max-w-3xl px-4 pt-6">
        <h2 id="problem" className="text-3xl sm:text-4xl">
          Be honest. Does prayer feel like this?
        </h2>
        <ul className="mt-6 space-y-3 text-lg">
          {[
            "You want to pray, but you never know what to say.",
            "You start strong on Monday and quit by Thursday.",
            "Your prayers feel like a voicemail no one checks.",
            "You have prayed for years, and somewhere along the way it went flat.",
            "You have never really prayed, and you are not sure you are allowed to.",
          ].map((line) => (
            <li key={line} className="flex gap-3">
              <span aria-hidden className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-lg">
          If any of that sounds like you, hear this first: <strong className="text-accent-ink">you are not behind.</strong> You
          are right where most people start. What you need is not more guilt. You need a simple path and seven honest minutes a
          day.
        </p>
      </section>

      {/* How it works */}
      <section aria-labelledby="how" className="mx-auto mt-20 max-w-5xl px-4">
        <p className="eyebrow text-center">How it works</p>
        <h2 id="how" className="mt-2 text-center text-3xl sm:text-4xl">
          Every day, four simple steps
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.label} className="card">
              <p className="font-serif text-4xl text-accent-ink">{i + 1}</p>
              <h3 className="mt-2 text-2xl">{s.label}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-center text-muted">
          Pick a time. Pick a place. A chair, a porch, the truck before you start it. Put your phone face down. Seven minutes.
        </p>
      </section>

      {/* The path */}
      <section aria-labelledby="path" className="mx-auto mt-20 max-w-3xl px-4">
        <p className="eyebrow">Inside the guide</p>
        <h2 id="path" className="mt-2 text-3xl sm:text-4xl">
          Your seven-day path
        </h2>
        <ol className="mt-8 space-y-4">
          {GUIDE.days.map((title, i) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/60 font-serif text-xl text-accent-ink">
                {i + 1}
              </span>
              <div>
                <h3 className="font-serif text-xl">{title}</h3>
                <p className="mt-1 text-muted">{DAY_HOOKS[i]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Outcomes */}
      <section aria-labelledby="outcomes" className="mx-auto mt-20 max-w-3xl px-4">
        <div className="card glow border-accent/40 sm:p-8">
          <h2 id="outcomes" className="text-3xl">
            By day seven, you will
          </h2>
          <ul className="mt-6 space-y-4 text-lg">
            {[
              "Have a simple prayer habit you can keep, not just start.",
              "Know how to talk to God in your own words, without a script.",
              "Feel the difference between knowing about God and walking with Him.",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <CheckIcon className="mt-1 shrink-0 text-accent" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who it's for */}
      <section aria-labelledby="who" className="mx-auto mt-20 max-w-3xl px-4">
        <h2 id="who" className="text-3xl sm:text-4xl">
          This guide is for you if
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "You have never prayed and want to start the right way.",
            "You used to pray and want that closeness back.",
            "You are busy and need something that fits in seven minutes.",
            "You want something simple to share with family, friends, or a small group.",
          ].map((line) => (
            <li key={line} className="rounded-xl border border-line bg-surface p-4">
              {line}
            </li>
          ))}
        </ul>
      </section>

      {/* Verse */}
      <section className="mx-auto mt-20 max-w-2xl px-4">
        <Scripture verse={{ reference: "James 4:8a", text: "Draw near to God, and he will draw near to you." }} size="lg" />
        <p className="mt-6 text-lg text-muted">
          God is not standing across the room with His arms crossed. You take one step toward Him. He takes the rest. This guide
          is your first step.
        </p>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="mx-auto mt-20 max-w-3xl px-4">
        <h2 id="faq" className="text-3xl sm:text-4xl">
          Questions
        </h2>
        <div className="mt-6 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-line bg-surface p-5">
              <summary className="cursor-pointer list-none font-semibold [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span aria-hidden className="text-2xl text-accent-ink transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section aria-labelledby="cta-bottom" className="mx-auto mt-20 max-w-3xl px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl">Your first seven minutes can start tomorrow morning.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Take a moment to think. What would change if you met with God every morning this week? The path is ready. Are you
            ready to step in?
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-xl">
          <CtaBox id="cta-bottom" />
        </div>
      </section>
    </>
  );
}
