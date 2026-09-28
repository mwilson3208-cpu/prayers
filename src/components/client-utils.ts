"use client";

export type ApiResult<T = Record<string, unknown>> = ({ ok: true } & T) | { ok: false; error: string };

export async function postJson<T = Record<string, unknown>>(url: string, body?: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (data && typeof data === "object" && "ok" in data) return data as ApiResult<T>;
    return { ok: false, error: "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "We could not reach the server. Please check your connection and try again." };
  }
}

const REACTED_KEY = "ctf_reacted";
const today = () => new Date().toISOString().slice(0, 10);

/** Local, per-device memory of today's reactions. The server checks too. */
export function reactedToday(kind: string, id: string): boolean {
  try {
    const map = JSON.parse(localStorage.getItem(REACTED_KEY) || "{}") as Record<string, string>;
    return map[`${kind}:${id}`] === today();
  } catch {
    return false;
  }
}

export function rememberReaction(kind: string, id: string) {
  try {
    const map = JSON.parse(localStorage.getItem(REACTED_KEY) || "{}") as Record<string, string>;
    const t = today();
    for (const k of Object.keys(map)) if (map[k] !== t) delete map[k];
    map[`${kind}:${id}`] = t;
    localStorage.setItem(REACTED_KEY, JSON.stringify(map));
  } catch {}
}
