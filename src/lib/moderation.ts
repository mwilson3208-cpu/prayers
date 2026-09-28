import { mentionsCrisis } from "./crisis";

// Basic filtering that runs before anything reaches the admin queue.
// Obvious spam is rejected with a friendly message. Profanity is masked
// and the item is flagged so the admin can take a closer look.

const PROFANITY = [
  "fuck\\w*",
  "motherfuck\\w*",
  "shit\\w*",
  "bullshit",
  "bitch\\w*",
  "bastard\\w*",
  "asshole\\w*",
  "cunt\\w*",
  "dickhead\\w*",
  "cocksucker\\w*",
  "pussy",
  "whore\\w*",
  "slut\\w*",
  "fag(got)?s?",
  "nigg(er|a)s?",
  "retard(ed|s)?",
  "twat\\w*",
  "wank\\w*",
  "piss(ed|ing)?",
];
const PROFANITY_SOURCE = `\\b(${PROFANITY.join("|")})\\b`;
const PROFANITY_TEST = new RegExp(PROFANITY_SOURCE, "i");

const SPAM_PATTERNS: RegExp[] = [
  /\b(viagra|cialis|casino|porn|xxx|escort|onlyfans)\b/i,
  /\b(crypto|bitcoin|forex|binary option|nft)\b.*\b(invest|profit|trade|earn|returns?)\b/i,
  /\b(invest|profit|earn|trade)\b.*\b(crypto|bitcoin|forex|binary option)\b/i,
  /\bspell ?cast(er|ing)?\b/i,
  /\b(love|money|lottery|powerful) spells?\b/i,
  /\b(herbal|native) (doctor|cure|medicine)\b/i,
  /\b(seo|backlinks?|guest post|web traffic)\b/i,
  /\b(loan|credit) (offer|lender|approval)\b/i,
  /\b(whats ?app|telegram|wechat)\b.*[+\d@]/i,
  /\bclick (here|the link|below)\b/i,
  /\bwork from home\b.*\$/i,
];

const LINK_RE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|info|biz|xyz|io|co|ru|cn|top|site|online|shop|club|link)\b)/gi;
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /\+?\d[\d\s().-]{9,}\d/;

export type ModerationResult = { ok: false; message: string } | { ok: true; flagged: boolean; flagReason: string | null };

export function moderate(...fields: string[]): ModerationResult {
  const all = fields.join("\n");
  const links = all.match(LINK_RE)?.length ?? 0;

  if (links > 0) {
    return { ok: false, message: "Please remove web links or website names and try again. Links are not allowed, to keep spam out." };
  }
  if (SPAM_PATTERNS.some((re) => re.test(all))) {
    return { ok: false, message: "Your message looks like spam to our filter. If this is a mistake, please reword it or use the contact form." };
  }
  if (/(.)\1{9,}/.test(all)) {
    return { ok: false, message: "Please remove the repeated characters and try again." };
  }

  const reasons: string[] = [];
  if (mentionsCrisis(all)) reasons.push("Possible crisis: may need urgent care");
  if (PROFANITY_TEST.test(all)) reasons.push("Profanity masked");
  if (EMAIL_RE.test(all) || PHONE_RE.test(all)) reasons.push("Contains contact details");

  return { ok: true, flagged: reasons.length > 0, flagReason: reasons.length ? reasons.join("; ") : null };
}

export function maskProfanity(text: string): string {
  return text.replace(new RegExp(PROFANITY_SOURCE, "gi"), (w) => w[0] + "*".repeat(w.length - 1));
}
