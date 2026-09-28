import "server-only";

/** Keeps a page up if the database is briefly unreachable. */
export async function safe<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[${label}]`, err);
    return fallback;
  }
}
