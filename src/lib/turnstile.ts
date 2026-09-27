import "server-only";
import { env } from "./env";

/** Verifies a Cloudflare Turnstile token. Skipped when no secret key is set. */
export async function verifyHuman(token: unknown, ip: string): Promise<boolean> {
  if (!env.turnstileSecret) return true;
  if (typeof token !== "string" || !token) return false;
  try {
    const body = new URLSearchParams({ secret: env.turnstileSecret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch (err) {
    console.error("Turnstile check failed", err);
    return false;
  }
}
