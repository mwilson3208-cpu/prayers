import type { Category } from "../constants";
import type {
  AdminCounts,
  AdminPrayer,
  AdminTestimony,
  ContactMessage,
  DigestRow,
  NewPrayer,
  NewTestimony,
  Page,
  PrayerBucket,
  PublicPrayer,
  PublicTestimony,
  ReactionKind,
  Stats,
  Status,
  Subscriber,
} from "../types";

export type RateTable = "prayers" | "testimonies" | "contact_messages";

/** Result of a reaction: the new count, or why it was not counted. */
export type ReactionResult = { ok: true; count: number } | { ok: false; reason: "already" | "not_found" };

export interface Store {
  // Public
  listPrayers(opts: { category?: Category | null; cursor?: string | null; limit: number }): Promise<Page<PublicPrayer>>;
  getPrayer(id: string): Promise<PublicPrayer | null>;
  listTestimonies(opts: { cursor?: string | null; limit: number }): Promise<Page<PublicTestimony>>;
  getStats(): Promise<Stats>;
  listApprovedPrayerIds(limit: number): Promise<{ id: string; createdAt: string }[]>;

  // Writes from visitors
  createPrayer(input: NewPrayer): Promise<{ id: string; unsubscribeToken: string | null }>;
  createTestimony(input: NewTestimony): Promise<{ id: string }>;
  createContactMessage(input: { name: string; email: string; message: string; ipHash: string }): Promise<void>;
  addSubscriber(email: string, source: string): Promise<{ token: string; isNew: boolean }>;
  unsubscribe(token: string): Promise<boolean>;
  react(kind: ReactionKind, targetId: string, deviceKey: string): Promise<ReactionResult>;
  countRecent(table: RateTable, ipHash: string, minutes: number): Promise<number>;

  // Admin
  adminCounts(): Promise<AdminCounts>;
  adminListPrayers(bucket: PrayerBucket): Promise<AdminPrayer[]>;
  adminUpdatePrayer(
    id: string,
    patch: Partial<{ status: Status; name: string; request: string; category: Category | null; flagged: boolean }>,
  ): Promise<void>;
  adminDeletePrayer(id: string): Promise<void>;
  adminListTestimonies(status: Status): Promise<AdminTestimony[]>;
  adminUpdateTestimony(
    id: string,
    patch: Partial<{ status: Status; name: string; prayedFor: string; answer: string; flagged: boolean }>,
  ): Promise<void>;
  adminDeleteTestimony(id: string): Promise<void>;
  adminListMessages(): Promise<ContactMessage[]>;
  adminMarkMessage(id: string, isRead: boolean): Promise<void>;
  adminDeleteMessage(id: string): Promise<void>;
  adminListSubscribers(): Promise<Subscriber[]>;

  // Scheduled jobs
  weeklyDigest(): Promise<DigestRow[]>;
  markNotified(prayerIds: string[]): Promise<void>;
  maintenance(): Promise<void>;
}
