import { after } from "next/server";
import { fail, ok, readJson } from "@/lib/api";
import { sendWelcomeGuide } from "@/lib/email";
import { getStore } from "@/lib/store";
import { clientIp } from "@/lib/security";
import { verifyHuman } from "@/lib/turnstile";
import { clean, isEmail } from "@/lib/validate";

export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return fail("Something went wrong. Please try again.");
  if (typeof body.website === "string" && body.website.trim()) return ok();

  const email = clean(body.email, 254).toLowerCase();
  if (!isEmail(email)) return fail("Please enter a valid email address.");
  if (!(await verifyHuman(body.turnstileToken, clientIp(req.headers)))) {
    return fail("We could not confirm you are a person. Please refresh and try again.", 403);
  }

  const { token, isNew } = await getStore().addSubscriber(email, "footer");
  if (isNew) after(() => sendWelcomeGuide(email, token));
  return ok();
}
