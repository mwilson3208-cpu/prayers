import "server-only";
import { randomUUID } from "node:crypto";
import seed from "@content/seed-data.json";
import type { Category } from "../constants";
import type { AdminPrayer, AdminTestimony, ContactMessage, Status, Subscriber } from "../types";
import type { Store } from "./types";

// Demo mode: everything lives in server memory and resets on restart.
// Used automatically when Supabase is not configured.

type MemPrayer = Omit<AdminPrayer, "email" | "notify"> & { ipHash: string | null };
type MemTestimony = AdminTestimony & { ipHash: string | null };
type MemContact = { prayerId: string; email: string; notify: boolean; token: string };
type MemMessage = ContactMessage & { ipHash: string };
type MemSubscriber = Subscriber & { token: string };
type MemReaction = { key: string; kind: string; targetId: string; at: number };

type DB = {
  prayers: MemPrayer[];
  testimonies: MemTestimony[];
  contacts: MemContact[];
  messages: MemMessage[];
  subscribers: MemSubscriber[];
  reactions: MemReaction[];
};

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000 - ((d * 37) % 600) * 60_000).toISOString();

function seedDb(): DB {
  return {
    prayers: seed.prayers.map((p) => ({
      id: p.id,
      name: p.name,
      request: p.request,
      category: p.category as Category,
      prayedCount: p.prayedCount,
      createdAt: daysAgo(p.daysAgo),
      status: p.status as Status,
      isPublic: p.isPublic,
      flagged: false,
      flagReason: null,
      ipHash: null,
    })),
    testimonies: seed.testimonies.map((t) => ({
      id: t.id,
      name: t.name,
      prayedFor: t.prayedFor,
      answer: t.answer,
      prayerId: t.prayerId,
      praiseCount: t.praiseCount,
      createdAt: daysAgo(t.daysAgo),
      status: t.status as Status,
      flagged: false,
      flagReason: null,
      ipHash: null,
    })),
    contacts: [],
    messages: [],
    subscribers: [],
    reactions: [],
  };
}

const g = globalThis as unknown as { __ctfDemoDb?: DB };
const db = (): DB => (g.__ctfDemoDb ??= seedDb());

const byNewest = <T extends { createdAt: string }>(a: T, b: T) => b.createdAt.localeCompare(a.createdAt);
const byOldest = <T extends { createdAt: string }>(a: T, b: T) => a.createdAt.localeCompare(b.createdAt);

function paginate<T extends { createdAt: string }>(rows: T[], cursor: string | null | undefined, limit: number) {
  const after = cursor ? rows.filter((r) => r.createdAt < cursor) : rows;
  const items = after.slice(0, limit);
  return { items, nextCursor: after.length > limit ? items[items.length - 1].createdAt : null };
}

const publicPrayer = ({ id, name, request, category, prayedCount, createdAt }: MemPrayer) => ({
  id,
  name,
  request,
  category,
  prayedCount,
  createdAt,
});

const publicTestimony = ({ id, name, prayedFor, answer, prayerId, praiseCount, createdAt }: MemTestimony) => ({
  id,
  name,
  prayedFor,
  answer,
  prayerId,
  praiseCount,
  createdAt,
});

const isVisible = (p: MemPrayer) => p.status === "approved" && p.isPublic;

export function createMemoryStore(): Store {
  return {
    async listPrayers({ category, cursor, limit }) {
      const rows = db()
        .prayers.filter((p) => isVisible(p) && (!category || p.category === category))
        .sort(byNewest);
      const page = paginate(rows, cursor, limit);
      return { items: page.items.map(publicPrayer), nextCursor: page.nextCursor };
    },

    async getPrayer(id) {
      const p = db().prayers.find((x) => x.id === id && isVisible(x));
      return p ? publicPrayer(p) : null;
    },

    async listTestimonies({ cursor, limit }) {
      const rows = db()
        .testimonies.filter((t) => t.status === "approved")
        .sort(byNewest);
      const page = paginate(rows, cursor, limit);
      return { items: page.items.map(publicTestimony), nextCursor: page.nextCursor };
    },

    async getStats() {
      const d = db();
      return {
        prayersSubmitted: d.prayers.filter((p) => p.status !== "hidden").length,
        prayersPrayed: d.prayers.reduce((sum, p) => sum + p.prayedCount, 0),
        answered: d.testimonies.filter((t) => t.status === "approved").length,
      };
    },

    async listApprovedPrayerIds(limit) {
      return db()
        .prayers.filter(isVisible)
        .sort(byNewest)
        .slice(0, limit)
        .map((p) => ({ id: p.id, createdAt: p.createdAt }));
    },

    async createPrayer(input) {
      const id = randomUUID();
      db().prayers.push({
        id,
        name: input.name,
        request: input.request,
        category: input.category,
        prayedCount: 0,
        createdAt: new Date().toISOString(),
        status: input.status,
        isPublic: input.isPublic,
        flagged: input.flagged,
        flagReason: input.flagReason,
        ipHash: input.ipHash,
      });
      let unsubscribeToken: string | null = null;
      if (input.email) {
        unsubscribeToken = randomUUID();
        db().contacts.push({ prayerId: id, email: input.email, notify: true, token: unsubscribeToken });
      }
      return { id, unsubscribeToken };
    },

    async createTestimony(input) {
      const id = randomUUID();
      db().testimonies.push({
        id,
        name: input.name,
        prayedFor: input.prayedFor,
        answer: input.answer,
        prayerId: input.prayerId,
        praiseCount: 0,
        createdAt: new Date().toISOString(),
        status: "pending",
        flagged: input.flagged,
        flagReason: input.flagReason,
        ipHash: input.ipHash,
      });
      return { id };
    },

    async createContactMessage(input) {
      db().messages.push({ id: randomUUID(), ...input, isRead: false, createdAt: new Date().toISOString() });
    },

    async addSubscriber(email, _source) {
      const existing = db().subscribers.find((s) => s.email === email);
      if (existing) {
        const wasOff = existing.unsubscribed;
        existing.unsubscribed = false;
        return { token: existing.token, isNew: wasOff };
      }
      const token = randomUUID();
      db().subscribers.push({ email, token, createdAt: new Date().toISOString(), unsubscribed: false });
      return { token, isNew: true };
    },

    async unsubscribe(token) {
      let found = false;
      for (const c of db().contacts) if (c.token === token) ((c.notify = false), (found = true));
      for (const s of db().subscribers) if (s.token === token) ((s.unsubscribed = true), (found = true));
      return found;
    },

    async react(kind, targetId, deviceKey) {
      const d = db();
      const target =
        kind === "prayed"
          ? d.prayers.find((p) => p.id === targetId && isVisible(p))
          : d.testimonies.find((t) => t.id === targetId && t.status === "approved");
      if (!target) return { ok: false, reason: "not_found" };
      const key = `${kind}:${targetId}:${deviceKey}:${new Date().toISOString().slice(0, 10)}`;
      if (d.reactions.some((r) => r.key === key)) return { ok: false, reason: "already" };
      d.reactions.push({ key, kind, targetId, at: Date.now() });
      if ("prayedCount" in target) return { ok: true, count: ++target.prayedCount };
      return { ok: true, count: ++(target as MemTestimony).praiseCount };
    },

    async countRecent(table, ipHash, minutes) {
      const since = new Date(Date.now() - minutes * 60_000).toISOString();
      const d = db();
      const rows: { ipHash: string | null; createdAt: string }[] =
        table === "prayers" ? d.prayers : table === "testimonies" ? d.testimonies : d.messages;
      return rows.filter((r) => r.ipHash === ipHash && r.createdAt > since).length;
    },

    async adminCounts() {
      const d = db();
      const pub = d.prayers.filter((p) => p.isPublic);
      return {
        prayers: {
          pending: pub.filter((p) => p.status === "pending").length,
          approved: pub.filter((p) => p.status === "approved").length,
          hidden: pub.filter((p) => p.status === "hidden").length,
          private: d.prayers.filter((p) => !p.isPublic).length,
        },
        testimonies: {
          pending: d.testimonies.filter((t) => t.status === "pending").length,
          approved: d.testimonies.filter((t) => t.status === "approved").length,
          hidden: d.testimonies.filter((t) => t.status === "hidden").length,
        },
        unreadMessages: d.messages.filter((m) => !m.isRead).length,
        subscribers: d.subscribers.filter((s) => !s.unsubscribed).length,
      };
    },

    async adminListPrayers(bucket) {
      const d = db();
      return d.prayers
        .filter((p) => (bucket === "private" ? !p.isPublic : p.isPublic && p.status === bucket))
        .sort(bucket === "pending" ? byOldest : byNewest)
        .map(({ ipHash: _ip, ...p }) => {
          const c = d.contacts.find((x) => x.prayerId === p.id);
          return { ...p, email: c?.email ?? null, notify: Boolean(c?.notify) };
        });
    },

    async adminUpdatePrayer(id, patch) {
      const p = db().prayers.find((x) => x.id === id);
      if (p) Object.assign(p, Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)));
    },

    async adminDeletePrayer(id) {
      const d = db();
      d.prayers = d.prayers.filter((p) => p.id !== id);
      d.contacts = d.contacts.filter((c) => c.prayerId !== id);
      for (const t of d.testimonies) if (t.prayerId === id) t.prayerId = null;
    },

    async adminListTestimonies(status) {
      return db()
        .testimonies.filter((t) => t.status === status)
        .sort(status === "pending" ? byOldest : byNewest)
        .map(({ ipHash: _ip, ...t }) => t);
    },

    async adminUpdateTestimony(id, patch) {
      const t = db().testimonies.find((x) => x.id === id);
      if (t) Object.assign(t, Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)));
    },

    async adminDeleteTestimony(id) {
      const d = db();
      d.testimonies = d.testimonies.filter((t) => t.id !== id);
    },

    async adminListMessages() {
      return [...db().messages].sort(byNewest).map(({ ipHash: _ip, ...m }) => m);
    },

    async adminMarkMessage(id, isRead) {
      const m = db().messages.find((x) => x.id === id);
      if (m) m.isRead = isRead;
    },

    async adminDeleteMessage(id) {
      const d = db();
      d.messages = d.messages.filter((m) => m.id !== id);
    },

    async adminListSubscribers() {
      return [...db().subscribers].sort(byNewest).map(({ token: _t, ...s }) => s);
    },

    async weeklyDigest() {
      const d = db();
      const weekAgo = Date.now() - 7 * 86_400_000;
      return d.contacts.flatMap((c) => {
        const p = d.prayers.find((x) => x.id === c.prayerId);
        if (!c.notify || !p || !isVisible(p)) return [];
        const n = d.reactions.filter((r) => r.kind === "prayed" && r.targetId === p.id && r.at > weekAgo).length;
        if (!n) return [];
        return [
          {
            prayerId: p.id,
            email: c.email,
            unsubscribeToken: c.token,
            name: p.name,
            request: p.request,
            prayedThisWeek: n,
            prayedTotal: p.prayedCount,
          },
        ];
      });
    },

    async markNotified() {},

    async maintenance() {
      const d = db();
      const cutoff = Date.now() - 30 * 86_400_000;
      d.reactions = d.reactions.filter((r) => r.at > cutoff);
    },
  };
}
