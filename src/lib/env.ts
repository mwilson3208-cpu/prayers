// Server-only configuration. Never import this from a client component.
import "server-only";

export const env = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  adminSessionSecret: process.env.ADMIN_SESSION_SECRET || "",
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY || "",
  resendKey: process.env.RESEND_API_KEY || "",
  emailFrom: process.env.EMAIL_FROM || "Closer to the Father <onboarding@resend.dev>",
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminAlerts: (process.env.ADMIN_ALERTS || "on").toLowerCase() !== "off",
  cronSecret: process.env.CRON_SECRET || "",
  hashSalt: process.env.HASH_SALT || process.env.ADMIN_SESSION_SECRET || "closer-to-the-father",
};

export const isDemoMode = !env.supabaseUrl || !env.supabaseServiceKey;
