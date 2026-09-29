export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function plural(n: number, one: string, many: string): string {
  return `${formatNumber(n)} ${n === 1 ? one : many}`;
}

/** Shortens text at a word boundary. */
export function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 3);
  const space = cut.lastIndexOf(" ");
  const word = space > max / 2 ? cut.slice(0, space) : cut;
  return `${word.replace(/[\s.,;:!?]+$/, "")}...`;
}

/** Unique, readable page title for a prayer request. */
export function prayerTitle(name: string, request: string): string {
  const who = name === "Anonymous" ? "Prayer request" : `Pray for ${name}`;
  return `${who}: ${clip(request, 58 - who.length)}`;
}

/**
 * Inner quotations inside a verse become single curly quotes, so a verse shown
 * inside double quotes reads “…said, ‘I am…’” instead of “…said, "I am…"”.
 */
export function nestQuotes(text: string): string {
  return text.replace(/"([^"]*)"/g, "‘$1’");
}
