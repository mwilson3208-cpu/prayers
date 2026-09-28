import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { CATEGORIES } from "@/lib/constants";
import { isDemoMode } from "@/lib/env";
import { formatDate } from "@/lib/format";
import { getStore } from "@/lib/store";
import type { AdminPrayer, AdminTestimony, PrayerBucket, Status } from "@/lib/types";
import {
  deleteMessage,
  deletePrayer,
  deleteTestimony,
  logout,
  markMessage,
  savePrayer,
  saveTestimony,
  setPrayerStatus,
  setTestimonyStatus,
} from "./actions";
import { ConfirmButton } from "./ConfirmButton";

export const metadata: Metadata = { title: "Admin dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Tab = "prayers" | "testimonies" | "messages" | "subscribers";
const TABS: Tab[] = ["prayers", "testimonies", "messages", "subscribers"];
const PRAYER_BUCKETS: PrayerBucket[] = ["pending", "approved", "hidden", "private"];
const STATUSES: Status[] = ["pending", "approved", "hidden"];

const label = (s: string) => s[0].toUpperCase() + s.slice(1);

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  if (!(await isAdmin())) redirect("/admin/login");

  const sp = await searchParams;
  const tab: Tab = TABS.includes(sp.tab as Tab) ? (sp.tab as Tab) : "prayers";
  const store = getStore();
  const counts = await store.adminCounts();

  const tabCount: Record<Tab, number> = {
    prayers: counts.prayers.pending,
    testimonies: counts.testimonies.pending,
    messages: counts.unreadMessages,
    subscribers: counts.subscribers,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Admin dashboard</h1>
        <form action={logout}>
          <button className="btn-secondary min-h-11 py-2 text-sm">Sign out</button>
        </form>
      </div>
      {isDemoMode && (
        <p className="mt-3 text-base text-accent-ink">Demo mode: changes live in memory and reset when the server restarts.</p>
      )}

      <nav aria-label="Admin sections" className="-mx-4 mt-6 overflow-x-auto px-4">
        <ul className="flex gap-2 border-b border-line">
          {TABS.map((t) => (
            <li key={t}>
              <Link
                href={`/admin?tab=${t}`}
                aria-current={tab === t ? "page" : undefined}
                className={`inline-flex min-h-12 items-center gap-2 border-b-2 px-3 text-base whitespace-nowrap ${
                  tab === t ? "border-accent font-semibold text-fg" : "border-transparent text-muted hover:text-fg"
                }`}
              >
                {label(t)}
                {tabCount[t] > 0 && (
                  <span className="rounded-full bg-accent px-2 text-sm font-bold text-on-accent">{tabCount[t]}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6">
        {tab === "prayers" && <PrayersTab bucket={pick(sp.status, PRAYER_BUCKETS, "pending")} counts={counts.prayers} />}
        {tab === "testimonies" && <TestimoniesTab status={pick(sp.status, STATUSES, "pending")} counts={counts.testimonies} />}
        {tab === "messages" && <MessagesTab />}
        {tab === "subscribers" && <SubscribersTab />}
      </div>
    </div>
  );
}

function pick<T extends string>(value: unknown, allowed: T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function StatusFilter<T extends string>({ tab, options, active, counts }: { tab: Tab; options: T[]; active: T; counts: Record<T, number> }) {
  return (
    <ul className="mb-6 flex flex-wrap gap-2">
      {options.map((o) => (
        <li key={o}>
          <Link
            href={`/admin?tab=${tab}&status=${o}`}
            aria-current={active === o ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-base ${
              active === o ? "border-accent bg-accent font-semibold text-on-accent" : "border-line text-muted hover:text-fg"
            }`}
          >
            {label(o)} ({counts[o]})
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Flag({ reason }: { reason: string | null }) {
  if (!reason) return null;
  const crisis = reason.toLowerCase().includes("crisis");
  return (
    <p className={`mt-3 rounded-lg px-3 py-2 text-sm font-semibold ${crisis ? "bg-red-900/60 text-red-50" : "bg-surface-2 text-accent-ink"}`}>
      {crisis ? "Urgent: " : "Flagged: "}
      {reason}
    </p>
  );
}

function StatusButtons({ id, current, action }: { id: string; current: Status; action: (fd: FormData) => Promise<void> }) {
  return (
    <>
      {current !== "approved" && (
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="approved" />
          <button className="btn-primary min-h-11 py-2 text-sm">Approve</button>
        </form>
      )}
      {current !== "hidden" && (
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="hidden" />
          <button className="btn-secondary min-h-11 py-2 text-sm">Hide</button>
        </form>
      )}
      {current === "hidden" && (
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="pending" />
          <button className="btn-secondary min-h-11 py-2 text-sm">Back to pending</button>
        </form>
      )}
    </>
  );
}

async function PrayersTab({ bucket, counts }: { bucket: PrayerBucket; counts: Record<PrayerBucket, number> }) {
  const items = await getStore().adminListPrayers(bucket);
  return (
    <>
      <StatusFilter tab="prayers" options={PRAYER_BUCKETS} active={bucket} counts={counts} />
      {bucket === "private" && (
        <p className="mb-4 text-base text-muted">Private requests are never shown publicly, whatever their status. They are for the prayer team only.</p>
      )}
      {items.length === 0 && <p className="card text-muted">Nothing here right now.</p>}
      <ul className="space-y-4">
        {items.map((p) => (
          <li key={p.id}>
            <PrayerItem p={p} />
          </li>
        ))}
      </ul>
    </>
  );
}

function PrayerItem({ p }: { p: AdminPrayer }) {
  return (
    <article className="card">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl">{p.name}</h2>
        <p className="text-sm text-muted">
          {formatDate(p.createdAt)} · {p.category ?? "No category"} · {p.isPublic ? "Public" : "Private"} · {p.status} · prayed{" "}
          {p.prayedCount}
        </p>
      </div>
      <Flag reason={p.flagReason} />
      <p className="mt-3 whitespace-pre-line">{p.request}</p>
      {p.email && (
        <p className="mt-3 text-sm text-muted">
          Email (admin only): <a href={`mailto:${p.email}`} className="underline">{p.email}</a>
          {p.notify ? "" : " (unsubscribed)"}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusButtons id={p.id} current={p.status} action={setPrayerStatus} />
        <form action={deletePrayer}>
          <input type="hidden" name="id" value={p.id} />
          <ConfirmButton message="Delete this prayer request forever?">Delete</ConfirmButton>
        </form>
        {p.status === "approved" && p.isPublic && (
          <Link href={`/prayer-wall/${p.id}`} className="btn-ghost min-h-11 py-2 text-sm">
            View
          </Link>
        )}
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer font-semibold text-accent-ink">Edit</summary>
        <form action={savePrayer} className="mt-4 space-y-4">
          <input type="hidden" name="id" value={p.id} />
          <label className="block">
            <span className="field-label">Name</span>
            <input name="name" defaultValue={p.name} maxLength={40} className="field" />
          </label>
          <label className="block">
            <span className="field-label">Request</span>
            <textarea name="request" defaultValue={p.request} maxLength={600} className="field min-h-36" />
          </label>
          <label className="block">
            <span className="field-label">Category</span>
            <select name="category" defaultValue={p.category ?? ""} className="field">
              <option value="">None</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="flagged" defaultChecked={p.flagged} className="h-5 w-5" /> Keep flagged
          </label>
          <button className="btn-primary">Save changes</button>
        </form>
      </details>
    </article>
  );
}

async function TestimoniesTab({ status, counts }: { status: Status; counts: Record<Status, number> }) {
  const items = await getStore().adminListTestimonies(status);
  return (
    <>
      <StatusFilter tab="testimonies" options={STATUSES} active={status} counts={counts} />
      {items.length === 0 && <p className="card text-muted">Nothing here right now.</p>}
      <ul className="space-y-4">
        {items.map((t) => (
          <li key={t.id}>
            <TestimonyItem t={t} />
          </li>
        ))}
      </ul>
    </>
  );
}

function TestimonyItem({ t }: { t: AdminTestimony }) {
  return (
    <article className="card">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl">{t.name}</h2>
        <p className="text-sm text-muted">
          {formatDate(t.createdAt)} · {t.status} · praise {t.praiseCount}
          {t.prayerId ? " · linked to a request" : ""}
        </p>
      </div>
      <Flag reason={t.flagReason} />
      <p className="mt-3">
        <strong>Prayed for:</strong> {t.prayedFor}
      </p>
      <p className="mt-2 whitespace-pre-line">{t.answer}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusButtons id={t.id} current={t.status} action={setTestimonyStatus} />
        <form action={deleteTestimony}>
          <input type="hidden" name="id" value={t.id} />
          <ConfirmButton message="Delete this testimony forever?">Delete</ConfirmButton>
        </form>
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer font-semibold text-accent-ink">Edit</summary>
        <form action={saveTestimony} className="mt-4 space-y-4">
          <input type="hidden" name="id" value={t.id} />
          <label className="block">
            <span className="field-label">Name</span>
            <input name="name" defaultValue={t.name} maxLength={40} className="field" />
          </label>
          <label className="block">
            <span className="field-label">Prayed for</span>
            <input name="prayedFor" defaultValue={t.prayedFor} maxLength={300} className="field" />
          </label>
          <label className="block">
            <span className="field-label">How God answered</span>
            <textarea name="answer" defaultValue={t.answer} maxLength={1200} className="field min-h-36" />
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="flagged" defaultChecked={t.flagged} className="h-5 w-5" /> Keep flagged
          </label>
          <button className="btn-primary">Save changes</button>
        </form>
      </details>
    </article>
  );
}

async function MessagesTab() {
  const items = await getStore().adminListMessages();
  if (!items.length) return <p className="card text-muted">No messages yet.</p>;
  return (
    <ul className="space-y-4">
      {items.map((m) => (
        <li key={m.id}>
          <article className={`card ${m.isRead ? "opacity-75" : "border-accent/50"}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-xl">
                {m.name} {!m.isRead && <span className="ml-2 rounded-full bg-accent px-2 text-sm font-bold text-on-accent">New</span>}
              </h2>
              <p className="text-sm text-muted">{formatDate(m.createdAt)}</p>
            </div>
            <p className="mt-1 text-sm">
              <a href={`mailto:${m.email}`} className="text-accent-ink underline">
                {m.email}
              </a>
            </p>
            <p className="mt-3 whitespace-pre-line">{m.message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`} className="btn-primary min-h-11 py-2 text-sm">
                Reply by email
              </a>
              <form action={markMessage}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="read" value={m.isRead ? "false" : "true"} />
                <button className="btn-secondary min-h-11 py-2 text-sm">{m.isRead ? "Mark unread" : "Mark read"}</button>
              </form>
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={m.id} />
                <ConfirmButton message="Delete this message?">Delete</ConfirmButton>
              </form>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

async function SubscribersTab() {
  const subs = await getStore().adminListSubscribers();
  const active = subs.filter((s) => !s.unsubscribed);
  return (
    <div className="card">
      <p className="text-lg">
        <strong>{active.length}</strong> active subscribers to the 7-Day Prayer Guide ({subs.length - active.length} unsubscribed).
      </p>
      <a href="/admin/export" className="btn-primary mt-4">
        Download as CSV
      </a>
      {active.length > 0 && (
        <ul className="mt-6 divide-y divide-line text-base">
          {active.slice(0, 50).map((s) => (
            <li key={s.email} className="flex justify-between gap-4 py-2">
              <span className="break-all">{s.email}</span>
              <span className="shrink-0 text-muted">{formatDate(s.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
      {active.length > 50 && <p className="mt-3 text-sm text-muted">Showing the newest 50. Download the CSV for the full list.</p>}
    </div>
  );
}
