// Server-only configuration. Never import this from a client component.
import "server-only";
import { SITE_URL } from "./site-url";

export const env = {
  // Same fallback chain as the pages, so email links never point at localhost.
  siteUrl: SITE_URL,
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  adminSessionSecret: process.env.ADMIN_SESSION_SECRET || "",
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY || "",
  resendKey: process.env.RESEND_API_KEY || "",
  emailFrom: normalizeFrom(process.env.EMAIL_FROM),
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminAlerts: (process.env.ADMIN_ALERTS || "on").toLowerCase() !== "off",
  cronSecret: process.env.CRON_SECRET || "",
  hashSalt: process.env.HASH_SALT || process.env.ADMIN_SESSION_SECRET || "closer-to-the-father",
};

/**
 * Accepts small typos in EMAIL_FROM (missing ">", stray quotes or spaces) so a
 * one-character slip in the Vercel settings does not stop every email.
 * Falls back to prayer@ the site's own domain when the value is unusable.
 */
function normalizeFrom(raw: string | undefined): string {
  const name = "Closer to the Father";
  let v = (raw || "").trim().replace(/^["']|["']$/g, "").trim();
  if (v.includes("<") && !v.includes(">")) v += ">";
  const angled = v.match(/^(.*?)\s*<\s*([^\s<>@]+@[^\s<>@]+\.[^\s<>@]+)\s*>$/);
  if (angled) return `${angled[1].trim() || name} <${angled[2]}>`;
  if (/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(v)) return `${name} <${v}>`;
  if (v) console.error(`EMAIL_FROM is not a valid address ("${v}"); using the site's own domain instead.`);
  const host = new URL(SITE_URL).hostname.replace(/^www\./, "");
  return /localhost|vercel\.app$/.test(host) ? `${name} <onboarding@resend.dev>` : `${name} <prayer@${host}>`;
}

export const isDemoMode = !env.supabaseUrl || !env.supabaseServiceKey;
