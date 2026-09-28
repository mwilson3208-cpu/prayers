import { after } from "next/server";
import { fail, guardSubmission, ok, readJson } from "@/lib/api";
import { isCategory, LIMITS, PAGE_SIZE } from "@/lib/constants";
import { sendAdminAlert, sendSubmissionConfirmation } from "@/lib/email";
import { maskProfanity, moderate } from "@/lib/moderation";
import { getStore } from "@/lib/store";
import { clean, cleanName, isEmail } from "@/lib/validate";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const cursor = url.searchParams.get("cursor");
  const page = await getStore().listPrayers({
    category: isCategory(category) ? category : null,
    cursor: cursor && !Number.isNaN(Date.parse(cursor)) ? cursor : null,
    limit: PAGE_SIZE,
  });
  return ok(page);
}

export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return fail("Something went wrong reading your request. Please try again.");

  const request = clean(body.request, LIMITS.request + 50);
  if (request.length < 3) return fail("Please share your prayer request.");
  if (request.length > LIMITS.request) return fail(`Please keep your request under ${LIMITS.request} characters.`);

  const emailRaw = clean(body.email, LIMITS.email).toLowerCase();
  if (emailRaw && !isEmail(emailRaw)) return fail("That email address does not look right. You can also leave it blank.");

  const guard = await guardSubmission(req, body, "prayers", 5);
  if ("error" in guard) return guard.error;

  const name = cleanName(body.name, LIMITS.name);
  const check = moderate(name, request);
  if (!check.ok) return fail(check.message);

  const isPublic = body.isPublic === true;
  const category = isCategory(body.category) ? body.category : null;
  const crisis = check.flagReason?.includes("crisis") ?? false;

  const created = await getStore().createPrayer({
    name: maskProfanity(name),
    request: maskProfanity(request),
    category,
    isPublic,
    email: emailRaw || null,
    flagged: check.flagged,
    flagReason: check.flagReason,
    ipHash: guard.ipHash,
  });

  after(async () => {
    if (emailRaw && created.unsubscribeToken) await sendSubmissionConfirmation(emailRaw, created.unsubscribeToken, isPublic);
    await sendAdminAlert(
      isPublic ? "New prayer request waiting for approval" : "New private prayer request",
      [
        ["From", name],
        ["Category", category ?? "None"],
        ["Visibility", isPublic ? "Public (pending approval)" : "Private (owner only)"],
        ["Request", request],
        ...(check.flagReason ? ([["Flags", check.flagReason]] as [string, string][]) : []),
      ],
      crisis,
    );
  });

  return ok({ id: created.id, crisis });
}
