import "server-only";
import { createHash } from "node:crypto";
import { env } from "./env";

type HeaderSource = { get(name: string): string | null };

export function clientIp(headers: HeaderSource): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}

/** One-way scramble. Raw IP addresses are never stored. */
export function hashValue(value: string): string {
  return createHash("sha256").update(`${env.hashSalt}:${value}`).digest("hex").slice(0, 32);
}

export function ipHash(headers: HeaderSource): string {
  return hashValue(`ip:${clientIp(headers)}`);
}

/** Identifies a device well enough to limit reactions to one per day. */
export function deviceKey(headers: HeaderSource): string {
  return hashValue(`device:${clientIp(headers)}:${headers.get("user-agent") || ""}`);
}
