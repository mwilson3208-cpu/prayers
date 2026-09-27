/** Trims, normalizes line breaks, and strips control characters. */
export function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

export function cleanName(value: unknown, max = 40): string {
  const name = clean(value, max).replace(/\s+/g, " ");
  return name || "Anonymous";
}

export function isEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

/** Pulls a prayer ID out of a pasted prayer link or a bare ID. */
export function extractUuid(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return value.match(UUID_RE)?.[0].toLowerCase() ?? null;
}
