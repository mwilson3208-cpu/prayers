import { after } from "next/server";
import { fail, guardSubmission, ok, readJson } from "@/lib/api";
import { LIMITS, PAGE_SIZE } from "@/lib/constants";
import { sendAdminAlert } from "@/lib/email";
import { maskProfanity, moderate } from "@/lib/moderation";
import { getStore } from "@/lib/store";
import { clean, cleanName, extractUuid } from "@/lib/validate";

export async function GET(req: Request) {
  const cursor = new URL(req.url).searchParams.get("cursor");
  const page = await getStore().listTestimonies({
    cursor: cursor && !Number.isNaN(Date.parse(cursor)) ? cursor : null,
    limit: PAGE_SIZE,
  });
  return ok(page);
}

export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return fail("Something went wrong reading your testimony. Please try again.");

  const prayedFor = clean(body.prayedFor, LIMITS.prayedFor + 50);
  const answer = clean(body.answer, LIMITS.answer + 50);
  if (prayedFor.length < 3) return fail("Please tell us what you prayed for.");
  if (answer.length < 3) return fail("Please tell us how God answered.");
  if (prayedFor.length > LIMITS.prayedFor) return fail(`Please keep "what you prayed for" under ${LIMITS.prayedFor} characters.`);
  if (answer.length > LIMITS.answer) return fail(`Please keep your testimony under ${LIMITS.answer} characters.`);

  // The link field is checked before the rate limit so a typo does not use up an attempt.
  const linkRaw = clean(body.prayerLink, 300);
  const linkedId = extractUuid(linkRaw);
  if (linkRaw && !linkedId) return fail("That link does not look like a prayer wall link. You can leave it blank.");

  const guard = await guardSubmission(req, body, "testimonies", 5);
  if ("error" in guard) return guard.error;

  const name = cleanName(body.name, LIMITS.name);
  // Links are only allowed in the dedicated field, so moderate the text fields only.
  const check = moderate(name, prayedFor, answer);
  if (!check.ok) return fail(check.message);

  const prayerId = linkedId && (await getStore().getPrayer(linkedId)) ? linkedId : null;

  await getStore().createTestimony({
    name: maskProfanity(name),
    prayedFor: maskProfanity(prayedFor),
    answer: maskProfanity(answer),
    prayerId,
    flagged: check.flagged,
    flagReason: check.flagReason,
    ipHash: guard.ipHash,
  });

  after(() =>
    sendAdminAlert("New answered prayer waiting for approval", [
      ["From", name],
      ["Prayed for", prayedFor],
      ["How God answered", answer],
      ...(check.flagReason ? ([["Flags", check.flagReason]] as [string, string][]) : []),
    ]),
  );

  return ok();
}
