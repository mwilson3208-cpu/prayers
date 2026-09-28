import type { Metadata } from "next";
import { PageHeader } from "@/components/Scripture";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} handles your information, in plain English.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Plain English" title="Privacy Policy" lead="Last updated September 27, 2026." />
      <div className="prose-page mx-auto max-w-3xl px-4">
        <p>
          Your prayer requests are personal. We treat them that way. This page explains what we collect, why, and what we never do.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Prayer requests and testimonies:</strong> the first name you type (or &ldquo;Anonymous&rdquo;), your words, and the
            category you choose.
          </li>
          <li>
            <strong>Your email, only if you give it:</strong> so we can confirm your request, tell you when people pray for you, send
            the prayer guide you asked for, or reply to your message.
          </li>
          <li>
            <strong>A scrambled version of your internet address:</strong> we never store your actual IP address. We store a
            one-way scrambled code so we can slow down spammers and count one &ldquo;I prayed&rdquo; per device per day.
          </li>
        </ul>

        <h2>What we never do</h2>
        <ul>
          <li>We never show your email address publicly.</li>
          <li>We never sell, rent, or trade your information.</li>
          <li>We never show ads or use advertising trackers.</li>
          <li>We never publish a private request. Private requests are read only by our prayer team.</li>
        </ul>

        <h2>Public requests</h2>
        <p>
          If you check &ldquo;Share this publicly,&rdquo; your first name, request, category, and date will be shown on the prayer
          wall after we review it. Please do not include last names, addresses, phone numbers, or details that could identify
          someone. We may edit a request to remove that kind of information, or choose not to publish it.
        </p>

        <h2>Emails and unsubscribing</h2>
        <p>
          Every email we send has an unsubscribe link at the bottom. One tap and you will stop hearing from us. We send a short note
          at most once a week about your prayer request.
        </p>

        <h2>Your browser</h2>
        <p>
          We store two small things in your browser: your light or dark mode choice, and which requests you prayed for today, so the
          button remembers. We do not use tracking cookies. The admin area uses one login cookie for our team only.
        </p>

        <h2>Services we use</h2>
        <p>
          The site runs on Vercel (hosting) and Supabase (database). Emails are sent through Resend. Forms are protected by
          Cloudflare Turnstile, which checks that you are a person. Videos are played from YouTube, which only loads when you press
          play. Each of these companies has its own privacy policy.
        </p>

        <h2>Removing your information</h2>
        <p>
          Want a request, testimony, or email removed? Use the contact form on the About page and tell us what to remove. We will
          delete it.
        </p>

        <h2>Children</h2>
        <p>This site is not intended for children under 13. If you are under 13, please ask a parent to help you.</p>

        <h2>Changes</h2>
        <p>If we change this policy, we will update the date at the top of this page.</p>
      </div>
    </>
  );
}
