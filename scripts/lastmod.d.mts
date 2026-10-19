export type PageDates = Record<string, { modified: string; published: string }>;
export function datesFromGit(): PageDates | null;
export function pageDates(): PageDates;
