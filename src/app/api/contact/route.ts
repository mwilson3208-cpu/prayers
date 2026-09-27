import { after } from "next/server";
import { fail, guardSubmission, ok, readJson } from "@/lib/api";
import { LIMITS } from "@/lib/constants";
import { sendAdminAlert } from "@/lib/email";
import { moderate } from "@/lib/moderation";
import { getStore } from "@/lib/store";
import { clean, cleanName, isEmail } from "@/lib/validate";

export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return fail("Something went wrong reading your message. Please try again.");

  const name = cleanName(body.name, LIMITS.contactName);
  const email = clean(body.email, LIMITS.email).toLowerCase();
  const message = clean(body.message, LIMITS.contactMessage + 50);
  if (!isEmail(email)) return fail("Please enter a valid email so we can reply.");
  if (message.length < 3) return fail("Please write a message.");
  if (message.length > LIMITS.contactMessage) return fail(`Please keep your message under ${LIMITS.contactMessage} characters.`);

  const guard = await guardSubmission(req, body, "contact_messages", 3);
  if ("error" in guard) return guard.error;

  const check = moderate(name, message);
  if (!check.ok) return fail(check.message);

  await getStore().createContactMessage({ name, email, message, ipHash: guard.ipHash });

  after(() =>
    sendAdminAlert(
      `New message from ${name}`,
      [
        ["From", `${name} <${email}>`],
        ["Message", message],
      ],
      check.flagReason?.includes("crisis") ?? false,
      email,
    ),
  );

  return ok();
}
