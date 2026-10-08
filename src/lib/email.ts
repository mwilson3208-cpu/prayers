import "server-only";
import { env } from "./env";
import { GUIDE, SITE } from "./content";

// Sends email through Resend's HTTP API (no extra package needed).
// When RESEND_API_KEY is empty, emails are written to the server log instead.

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const unsubscribeUrl = (token: string) => `${env.siteUrl}/unsubscribe?t=${encodeURIComponent(token)}`;

function layout(bodyHtml: string, unsubscribeToken?: string) {
  const footer = unsubscribeToken
    ? `<p style="margin:24px 0 0;font-size:13px;color:#6b7a90">Do not want these emails? <a href="${unsubscribeUrl(unsubscribeToken)}" style="color:#8a6414">Unsubscribe</a>.</p>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#f5efe0;padding:24px 12px;font-family:Georgia,serif;color:#0b1d3a">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px 24px;border-top:4px solid #d4a853">
<p style="margin:0 0 16px;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#8a6414">${esc(SITE.name)}</p>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6">${bodyHtml}</div>
${footer}
</div>
<p style="text-align:center;font-size:12px;color:#6b7a90;font-family:Arial,sans-serif">${esc(SITE.tagline)}<br><a href="${env.siteUrl}" style="color:#6b7a90">${esc(env.siteUrl.replace(/^https?:\/\//, ""))}</a></p>
</body></html>`;
}

type Mail = { to: string | string[]; subject: string; html: string; text: string; unsubscribeToken?: string; replyTo?: string };

export async function sendEmail(mail: Mail): Promise<boolean> {
  if (!env.resendKey) {
    console.info(`[email skipped: RESEND_API_KEY not set] to=${mail.to} subject="${mail.subject}"`);
    return false;
  }
  const headers: Record<string, string> = {};
  if (mail.unsubscribeToken) {
    headers["List-Unsubscribe"] = `<${unsubscribeUrl(mail.unsubscribeToken)}>`;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.emailFrom,
        to: Array.isArray(mail.to) ? mail.to : [mail.to],
        subject: mail.subject,
        html: layout(mail.html, mail.unsubscribeToken),
        text: mail.text + (mail.unsubscribeToken ? `\n\nUnsubscribe: ${unsubscribeUrl(mail.unsubscribeToken)}` : ""),
        headers,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("Resend error", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("Email send failed", err);
    return false;
  }
}

// ---------------------------------------------------------------------

export function sendSubmissionConfirmation(to: string, token: string, isPublic: boolean, posted = false) {
  const weekly = "When people pray for you, we will send you a short note once a week with the count.";
  const next = !isPublic
    ? "You asked to keep your request private, so only our prayer team will see it."
    : posted
      ? `Your request is on the prayer wall now, so others can pray for you too. ${weekly}`
      : `Once a member of our team reviews it, your request will appear on the prayer wall. ${weekly}`;
  return sendEmail({
    to,
    subject: "We received your prayer request",
    unsubscribeToken: token,
    html: `<p>Thank you for trusting us with your prayer request. You are not alone. We are praying with you.</p>
<p>${esc(next)}</p>
<p style="border-left:3px solid #d4a853;padding-left:12px;font-family:Georgia,serif"><em>"Casting all your anxieties on him, because he cares for you."</em><br>1 Peter 5:7</p>
<p><a href="${env.siteUrl}/prayer-wall" style="color:#8a6414">Pray for others on the prayer wall</a></p>`,
    text: `Thank you for trusting us with your prayer request. You are not alone. We are praying with you.\n\n${next}\n\n"Casting all your anxieties on him, because he cares for you." 1 Peter 5:7\n\nPray for others: ${env.siteUrl}/prayer-wall`,
  });
}

export function sendWeeklyPrayedNote(row: { email: string; unsubscribeToken: string; prayerId: string; prayedThisWeek: number; prayedTotal: number }) {
  const n = row.prayedThisWeek;
  const people = n === 1 ? "1 person" : `${n} people`;
  const link = `${env.siteUrl}/prayer-wall/${row.prayerId}`;
  return sendEmail({
    to: row.email,
    subject: `${people} prayed for you this week`,
    unsubscribeToken: row.unsubscribeToken,
    html: `<p>This week, <strong>${people}</strong> stopped and prayed for your request on ${esc(SITE.name)}. That brings the total to ${row.prayedTotal}.</p>
<p>You are seen, and you are carried in prayer.</p>
<p style="border-left:3px solid #d4a853;padding-left:12px;font-family:Georgia,serif"><em>"Bear one another's burdens, and so fulfill the law of Christ."</em><br>Galatians 6:2</p>
<p><a href="${link}" style="color:#8a6414">See your request</a>. If God has answered, we would love for you to <a href="${env.siteUrl}/answered" style="color:#8a6414">share your testimony</a>.</p>`,
    text: `This week, ${people} prayed for your request on ${SITE.name}. Total so far: ${row.prayedTotal}.\n\nYou are seen, and you are carried in prayer.\n\nSee your request: ${link}\nShare an answered prayer: ${env.siteUrl}/answered`,
  });
}

export function sendWelcomeGuide(to: string, token: string) {
  return sendEmail({
    to,
    subject: "Your free 7-day prayer guide",
    unsubscribeToken: token,
    html: `<p>Welcome. We are so glad you are here.</p>
<p>Your 7-Day Prayer Guide is ready. Seven minutes a day, seven days, one step closer to Him.</p>
<p><a href="${env.siteUrl}${GUIDE.file}" style="display:inline-block;background:#d4a853;color:#0b1d3a;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Download the 7-Day Prayer Guide</a></p>
<p>You can also pray along every day on our <a href="${SITE.youtube.channelUrl}" style="color:#8a6414">YouTube channel</a>.</p>`,
    text: `Welcome. Your 7-Day Prayer Guide is ready: ${env.siteUrl}${GUIDE.file}\n\nPray along every day on YouTube: ${SITE.youtube.channelUrl}`,
  });
}

export async function sendAdminAlert(subject: string, lines: [string, string][], urgent = false, replyTo?: string) {
  if (!env.adminAlerts || !env.adminEmail) return false;
  const rows = lines
    .map(([k, v]) => `<p style="margin:0 0 10px"><strong>${esc(k)}:</strong><br>${esc(v).replace(/\n/g, "<br>")}</p>`)
    .join("");
  const banner = urgent
    ? `<p style="background:#fff4e5;border:1px solid #d4a853;padding:10px;border-radius:8px"><strong>This may be someone in crisis.</strong> The crisis notice with the 988 Lifeline was shown to them. Please review it soon.</p>`
    : "";
  return sendEmail({
    to: env.adminEmail,
    subject: `${urgent ? "[Urgent] " : ""}${subject}`,
    replyTo,
    html: `${banner}${rows}<p><a href="${env.siteUrl}/admin" style="color:#8a6414">Open the admin dashboard</a></p>`,
    text: `${urgent ? "URGENT: possible crisis.\n\n" : ""}${lines.map(([k, v]) => `${k}: ${v}`).join("\n\n")}\n\nAdmin: ${env.siteUrl}/admin`,
  });
}

/** Tells the ministry team each time someone signs up for the guide. */
export function sendGuideSignupAlert(subscriber: string, source: "footer" | "guide", isNew: boolean) {
  const to = String(SITE.notifications?.guideSignupAlertTo ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  if (!to.length) return Promise.resolve(false);
  const where = source === "guide" ? "the 7-Day Prayer Guide page (/7days)" : "the sign-up box at the bottom of the website";
  const status = isNew ? "New subscriber" : "Already on the list (downloaded the guide again)";
  const when = new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });
  return sendEmail({
    to,
    replyTo: subscriber,
    subject: `${isNew ? "New" : "Repeat"} 7-Day Prayer Guide sign-up: ${subscriber}`,
    html: `<p>Someone just signed up for the free 7-Day Prayer Guide.</p>
<p style="margin:0 0 10px"><strong>Email:</strong><br><a href="mailto:${esc(subscriber)}" style="color:#8a6414">${esc(subscriber)}</a></p>
<p style="margin:0 0 10px"><strong>Signed up on:</strong><br>${esc(where)}</p>
<p style="margin:0 0 10px"><strong>Status:</strong><br>${esc(status)}</p>
<p style="margin:0 0 10px"><strong>When:</strong><br>${esc(when)} (Eastern)</p>
<p>Reply to this email to write to them directly. <a href="${env.siteUrl}/admin?tab=subscribers" style="color:#8a6414">See all subscribers</a></p>`,
    text: `Someone just signed up for the free 7-Day Prayer Guide.\n\nEmail: ${subscriber}\nSigned up on: ${where}\nStatus: ${status}\nWhen: ${when} (Eastern)\n\nAll subscribers: ${env.siteUrl}/admin?tab=subscribers`,
  });
}
