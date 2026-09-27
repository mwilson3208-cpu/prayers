import "server-only";
import { NextResponse } from "next/server";
import { getStore } from "./store";
import type { RateTable } from "./store/types";
import { clientIp, ipHash } from "./security";
import { verifyHuman } from "./turnstile";

export const ok = (data: Record<string, unknown> = {}) => NextResponse.json({ ok: true, ...data });
export const fail = (message: string, status = 400) => NextResponse.json({ ok: false, error: message }, { status });

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * Checks shared by every public form: hidden honeypot field, human check,
 * and a per-visitor hourly limit. Returns an error response or the IP hash.
 */
export async function guardSubmission(
  req: Request,
  body: Record<string, unknown>,
  table: RateTable,
  perHour: number,
): Promise<{ error: NextResponse } | { ipHash: string }> {
  // Bots fill in every field, including the hidden "website" one.
  if (typeof body.website === "string" && body.website.trim()) {
    return { error: ok() };
  }
  if (!(await verifyHuman(body.turnstileToken, clientIp(req.headers)))) {
    return { error: fail("We could not confirm you are a person. Please refresh the page and try again.", 403) };
  }
  const hash = ipHash(req.headers);
  const recent = await getStore().countRecent(table, hash, 60);
  if (recent >= perHour) {
    return { error: fail("You have sent several in a short time. Please wait a little while and try again.", 429) };
  }
  return { ipHash: hash };
}
