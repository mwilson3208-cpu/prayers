import type { Category } from "./constants";

export type Status = "pending" | "approved" | "hidden";
export type PrayerBucket = Status | "private";
export type ReactionKind = "prayed" | "praise";

export type PublicPrayer = {
  id: string;
  name: string;
  request: string;
  category: Category | null;
  prayedCount: number;
  createdAt: string;
};

export type PublicTestimony = {
  id: string;
  name: string;
  prayedFor: string;
  answer: string;
  prayerId: string | null;
  praiseCount: number;
  createdAt: string;
};

export type Moderation = { status: Status; flagged: boolean; flagReason: string | null };

export type AdminPrayer = PublicPrayer & Moderation & { isPublic: boolean; email: string | null; notify: boolean };
export type AdminTestimony = PublicTestimony & Moderation;

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type Stats = { prayersSubmitted: number; prayersPrayed: number; answered: number };

export type Page<T> = { items: T[]; nextCursor: string | null };

export type NewPrayer = {
  name: string;
  request: string;
  category: Category | null;
  isPublic: boolean;
  email: string | null;
  flagged: boolean;
  flagReason: string | null;
  ipHash: string;
};

export type NewTestimony = {
  name: string;
  prayedFor: string;
  answer: string;
  prayerId: string | null;
  flagged: boolean;
  flagReason: string | null;
  ipHash: string;
};

export type DigestRow = {
  prayerId: string;
  email: string;
  unsubscribeToken: string;
  name: string;
  request: string;
  prayedThisWeek: number;
  prayedTotal: number;
};

export type Subscriber = { email: string; createdAt: string; unsubscribed: boolean };

export type AdminCounts = {
  prayers: Record<PrayerBucket, number>;
  testimonies: Record<Status, number>;
  unreadMessages: number;
  subscribers: number;
};
