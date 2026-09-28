import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/store";
import { isUuid } from "@/lib/validate";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false } };

async function unsubscribe(formData: FormData) {
  "use server";
  const token = formData.get("t");
  if (!isUuid(token)) redirect("/unsubscribe?status=invalid");
  const found = await getStore().unsubscribe(token as string);
  redirect(`/unsubscribe?status=${found ? "done" : "invalid"}`);
}

export default async function UnsubscribePage({ searchParams }: PageProps<"/unsubscribe">) {
  const sp = await searchParams;
  const token = typeof sp.t === "string" ? sp.t : "";
  const status = typeof sp.status === "string" ? sp.status : "";

  return (
    <div className="glow">
      <div className="mx-auto max-w-xl px-4 pt-16 pb-8">
        <div className="card">
          {status === "done" ? (
            <>
              <h1 className="text-3xl">You are unsubscribed.</h1>
              <p className="mt-3">You will not get any more of these emails. We are still praying for you.</p>
            </>
          ) : status === "invalid" || (!token && !status) ? (
            <>
              <h1 className="text-3xl">That link did not work.</h1>
              <p className="mt-3">It may have already been used. If you are still getting emails, send us a note from the contact form and we will remove you.</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl">Stop these emails?</h1>
              <p className="mt-3">Tap the button below and we will stop emailing this address.</p>
              <form action={unsubscribe} className="mt-6">
                <input type="hidden" name="t" value={token} />
                <button type="submit" className="btn-primary w-full">
                  Unsubscribe
                </button>
              </form>
            </>
          )}
          <Link href="/" className="btn-ghost mt-4 w-full">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
