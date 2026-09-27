export const CATEGORIES = [
  "Health",
  "Family",
  "Finances",
  "Anxiety and Peace",
  "Grief",
  "Direction",
  "Salvation",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}

export const LIMITS = {
  name: 40,
  request: 600,
  prayedFor: 300,
  answer: 1200,
  contactName: 80,
  contactMessage: 2000,
  email: 254,
} as const;

export const PAGE_SIZE = 10;
