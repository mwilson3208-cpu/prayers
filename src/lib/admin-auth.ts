import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { env, isDemoMode } from "./env";

const COOKIE = "ctf_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

/** In demo mode with no password set, the admin password is "demo". */
export function adminPassword(): string {
  return env.adminPassword || (isDemoMode ? "demo" : "");
}

function secret(): string {
  return env.adminSessionSecret || `session:${adminPassword()}:${env.supabaseServiceKey}`;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(input: string): boolean {
  const expected = adminPassword();
  if (!expected) return false;
  // Compare fixed-length digests so the check takes the same time for any input.
  return safeEqual(sign(`pw:${input}`), sign(`pw:${expected}`));
}

export async function startSession() {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const value = `${expires}.${sign(`admin:${expires}`)}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminPassword()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expires, sig] = value.split(".");
  if (!expires || !sig || Number(expires) < Date.now() / 1000) return false;
  return safeEqual(sig, sign(`admin:${expires}`));
}
