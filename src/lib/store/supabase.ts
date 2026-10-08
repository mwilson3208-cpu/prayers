import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Category } from "../constants";
import type { AdminPrayer, AdminTestimony, PrayerBucket, PublicPrayer, PublicTestimony, Status } from "../types";
import type { Store } from "./types";

const PRAYER_PUBLIC = "id, name, request, category, prayed_count, created_at";
const TESTIMONY_PUBLIC = "id, name, prayed_for, answer, prayer_id, praise_count, created_at";

type Row = Record<string, unknown>;

const toPrayer = (r: Row): PublicPrayer => ({
  id: r.id as string,
  name: r.name as string,
  request: r.request as string,
  category: (r.category as Category | null) ?? null,
  prayedCount: r.prayed_count as number,
  createdAt: r.created_at as string,
});

const toTestimony = (r: Row): PublicTestimony => ({
  id: r.id as string,
  name: r.name as string,
  prayedFor: r.prayed_for as string,
  answer: r.answer as string,
  prayerId: (r.prayer_id as string | null) ?? null,
  praiseCount: r.praise_count as number,
  createdAt: r.created_at as string,
});

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(`Database error: ${res.error.message}`);
  return res.data;
}

function page<T>(rows: T[], limit: number, cursorOf: (row: T) => string) {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  return { items, nextCursor: hasMore ? cursorOf(items[items.length - 1]) : null };
}

export function createSupabaseStore(url: string, serviceKey: string): Store {
  const db: SupabaseClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return {
    async listPrayers({ category, cursor, limit }) {
      let q = db
        .from("prayers")
        .select(PRAYER_PUBLIC)
        .eq("status", "approved")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(limit + 1);
      if (category) q = q.eq("category", category);
      if (cursor) q = q.lt("created_at", cursor);
      const rows = check(await q) as Row[];
      return page(rows.map(toPrayer), limit, (p) => p.createdAt);
    },

    async getPrayer(id) {
      const res = await db
        .from("prayers")
        .select(PRAYER_PUBLIC)
        .eq("id", id)
        .eq("status", "approved")
        .eq("is_public", true)
        .maybeSingle();
      const row = check(res) as Row | null;
      return row ? toPrayer(row) : null;
    },

    async listTestimonies({ cursor, limit }) {
      let q = db
        .from("testimonies")
        .select(TESTIMONY_PUBLIC)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(limit + 1);
      if (cursor) q = q.lt("created_at", cursor);
      const rows = check(await q) as Row[];
      return page(rows.map(toTestimony), limit, (t) => t.createdAt);
    },

    async getStats() {
      const rows = check(await db.rpc("site_stats")) as Row[];
      const r = rows?.[0] ?? {};
      return {
        prayersSubmitted: Number(r.prayers_submitted ?? 0),
        prayersPrayed: Number(r.prayers_prayed ?? 0),
        answered: Number(r.answered ?? 0),
      };
    },

    async listApprovedPrayerIds(limit) {
      const rows = check(
        await db
          .from("prayers")
          .select("id, created_at")
          .eq("status", "approved")
          .eq("is_public", true)
          .order("created_at", { ascending: false })
          .limit(limit),
      ) as Row[];
      return rows.map((r) => ({ id: r.id as string, createdAt: r.created_at as string }));
    },

    async createPrayer(input) {
      const row = check(
        await db
          .from("prayers")
          .insert({
            name: input.name,
            request: input.request,
            category: input.category,
            is_public: input.isPublic,
            flagged: input.flagged,
            flag_reason: input.flagReason,
            ip_hash: input.ipHash,
            status: input.status,
          })
          .select("id")
          .single(),
      ) as Row;
      const id = row.id as string;
      let unsubscribeToken: string | null = null;
      if (input.email) {
        const contact = check(
          await db.from("prayer_contacts").insert({ prayer_id: id, email: input.email }).select("unsubscribe_token").single(),
        ) as Row;
        unsubscribeToken = contact.unsubscribe_token as string;
      }
      return { id, unsubscribeToken };
    },

    async createTestimony(input) {
      const row = check(
        await db
          .from("testimonies")
          .insert({
            name: input.name,
            prayed_for: input.prayedFor,
            answer: input.answer,
            prayer_id: input.prayerId,
            flagged: input.flagged,
            flag_reason: input.flagReason,
            ip_hash: input.ipHash,
          })
          .select("id")
          .single(),
      ) as Row;
      return { id: row.id as string };
    },

    async createContactMessage(input) {
      check(
        await db
          .from("contact_messages")
          .insert({ name: input.name, email: input.email, message: input.message, ip_hash: input.ipHash }),
      );
    },

    async addSubscriber(email, source) {
      const existing = check(
        await db.from("subscribers").select("unsubscribe_token, unsubscribed_at").eq("email", email).maybeSingle(),
      ) as Row | null;
      if (existing) {
        if (existing.unsubscribed_at) {
          check(await db.from("subscribers").update({ unsubscribed_at: null }).eq("email", email));
          return { token: existing.unsubscribe_token as string, isNew: true };
        }
        return { token: existing.unsubscribe_token as string, isNew: false };
      }
      const row = check(
        await db.from("subscribers").insert({ email, source }).select("unsubscribe_token").single(),
      ) as Row;
      return { token: row.unsubscribe_token as string, isNew: true };
    },

    async unsubscribe(token) {
      const a = check(
        await db.from("prayer_contacts").update({ notify: false }).eq("unsubscribe_token", token).select("prayer_id"),
      ) as Row[];
      const b = check(
        await db
          .from("subscribers")
          .update({ unsubscribed_at: new Date().toISOString() })
          .eq("unsubscribe_token", token)
          .select("id"),
      ) as Row[];
      return a.length + b.length > 0;
    },

    async react(kind, targetId, deviceKey) {
      const count = check(
        await db.rpc("record_reaction", { p_kind: kind, p_target: targetId, p_device: deviceKey }),
      ) as number;
      if (count === -1) return { ok: false, reason: "already" };
      if (count === -2) return { ok: false, reason: "not_found" };
      return { ok: true, count };
    },

    async countRecent(table, ipHash, minutes) {
      const since = new Date(Date.now() - minutes * 60_000).toISOString();
      const res = await db
        .from(table)
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gt("created_at", since);
      if (res.error) throw new Error(`Database error: ${res.error.message}`);
      return res.count ?? 0;
    },

    async adminCounts() {
      const count = async (table: string, apply: (q: any) => any) => {
        const res = await apply(db.from(table).select("id", { count: "exact", head: true }));
        if (res.error) throw new Error(`Database error: ${res.error.message}`);
        return (res.count as number) ?? 0;
      };
      const [pp, pa, ph, pv, tp, ta, th, unread, subs] = await Promise.all([
        count("prayers", (q) => q.eq("is_public", true).eq("status", "pending")),
        count("prayers", (q) => q.eq("is_public", true).eq("status", "approved")),
        count("prayers", (q) => q.eq("is_public", true).eq("status", "hidden")),
        count("prayers", (q) => q.eq("is_public", false)),
        count("testimonies", (q) => q.eq("status", "pending")),
        count("testimonies", (q) => q.eq("status", "approved")),
        count("testimonies", (q) => q.eq("status", "hidden")),
        count("contact_messages", (q) => q.eq("is_read", false)),
        count("subscribers", (q) => q.is("unsubscribed_at", null)),
      ]);
      return {
        prayers: { pending: pp, approved: pa, hidden: ph, private: pv },
        testimonies: { pending: tp, approved: ta, hidden: th },
        unreadMessages: unread,
        subscribers: subs,
      };
    },

    async adminListPrayers(bucket: PrayerBucket) {
      let q = db
        .from("prayers")
        .select(`${PRAYER_PUBLIC}, status, is_public, flagged, flag_reason, prayer_contacts(email, notify)`)
        .order("created_at", { ascending: bucket === "pending" })
        .limit(200);
      q = bucket === "private" ? q.eq("is_public", false) : q.eq("is_public", true).eq("status", bucket);
      const rows = check(await q) as Row[];
      return rows.map((r): AdminPrayer => {
        const c = (Array.isArray(r.prayer_contacts) ? r.prayer_contacts[0] : r.prayer_contacts) as Row | null;
        return {
          ...toPrayer(r),
          status: r.status as Status,
          isPublic: r.is_public as boolean,
          flagged: r.flagged as boolean,
          flagReason: (r.flag_reason as string | null) ?? null,
          email: (c?.email as string) ?? null,
          notify: Boolean(c?.notify),
        };
      });
    },

    async adminUpdatePrayer(id, patch) {
      const update: Row = {};
      if (patch.status) {
        update.status = patch.status;
        if (patch.status === "approved") update.approved_at = new Date().toISOString();
      }
      if (patch.name !== undefined) update.name = patch.name;
      if (patch.request !== undefined) update.request = patch.request;
      if (patch.category !== undefined) update.category = patch.category;
      if (patch.flagged !== undefined) update.flagged = patch.flagged;
      check(await db.from("prayers").update(update).eq("id", id));
    },

    async adminDeletePrayer(id) {
      check(await db.from("prayers").delete().eq("id", id));
    },

    async adminListTestimonies(status) {
      const rows = check(
        await db
          .from("testimonies")
          .select(`${TESTIMONY_PUBLIC}, status, flagged, flag_reason`)
          .eq("status", status)
          .order("created_at", { ascending: status === "pending" })
          .limit(200),
      ) as Row[];
      return rows.map(
        (r): AdminTestimony => ({
          ...toTestimony(r),
          status: r.status as Status,
          flagged: r.flagged as boolean,
          flagReason: (r.flag_reason as string | null) ?? null,
        }),
      );
    },

    async adminUpdateTestimony(id, patch) {
      const update: Row = {};
      if (patch.status) {
        update.status = patch.status;
        if (patch.status === "approved") update.approved_at = new Date().toISOString();
      }
      if (patch.name !== undefined) update.name = patch.name;
      if (patch.prayedFor !== undefined) update.prayed_for = patch.prayedFor;
      if (patch.answer !== undefined) update.answer = patch.answer;
      if (patch.flagged !== undefined) update.flagged = patch.flagged;
      check(await db.from("testimonies").update(update).eq("id", id));
    },

    async adminDeleteTestimony(id) {
      check(await db.from("testimonies").delete().eq("id", id));
    },

    async adminListMessages() {
      const rows = check(
        await db
          .from("contact_messages")
          .select("id, name, email, message, is_read, created_at")
          .order("created_at", { ascending: false })
          .limit(200),
      ) as Row[];
      return rows.map((r) => ({
        id: r.id as string,
        name: r.name as string,
        email: r.email as string,
        message: r.message as string,
        isRead: r.is_read as boolean,
        createdAt: r.created_at as string,
      }));
    },

    async adminMarkMessage(id, isRead) {
      check(await db.from("contact_messages").update({ is_read: isRead }).eq("id", id));
    },

    async adminDeleteMessage(id) {
      check(await db.from("contact_messages").delete().eq("id", id));
    },

    async adminListSubscribers() {
      const rows = check(
        await db
          .from("subscribers")
          .select("email, created_at, unsubscribed_at")
          .order("created_at", { ascending: false })
          .limit(5000),
      ) as Row[];
      return rows.map((r) => ({
        email: r.email as string,
        createdAt: r.created_at as string,
        unsubscribed: Boolean(r.unsubscribed_at),
      }));
    },

    async weeklyDigest() {
      const rows = check(await db.rpc("weekly_prayer_digest")) as Row[];
      return (rows ?? []).map((r) => ({
        prayerId: r.prayer_id as string,
        email: r.email as string,
        unsubscribeToken: r.unsubscribe_token as string,
        name: r.name as string,
        request: r.request as string,
        prayedThisWeek: Number(r.prayed_this_week),
        prayedTotal: Number(r.prayed_total),
      }));
    },

    async markNotified(prayerIds) {
      if (!prayerIds.length) return;
      check(
        await db.from("prayer_contacts").update({ last_notified_at: new Date().toISOString() }).in("prayer_id", prayerIds),
      );
    },

    async maintenance() {
      check(await db.rpc("prune_reactions"));
    },
  };
}
