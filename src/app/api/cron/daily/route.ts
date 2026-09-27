import { NextResponse } from "next/server";
import { sendWeeklyPrayedNote } from "@/lib/email";
import { env } from "@/lib/env";
import { getStore } from "@/lib/store";

// Runs once a day (see vercel.json). Every day it trims old reaction rows,
// which also keeps the free Supabase project from pausing for inactivity.
// On Mondays it sends the weekly "people prayed for you" notes.
export async function GET(req: Request) {
  if (!env.cronSecret || req.headers.get("authorization") !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const store = getStore();
  await store.maintenance();

  const url = new URL(req.url);
  const isMonday = new Date().getUTCDay() === 1;
  if (!isMonday && url.searchParams.get("digest") !== "now") {
    return NextResponse.json({ ok: true, digest: "skipped (runs on Mondays)" });
  }

  const rows = await store.weeklyDigest();
  let sent = 0;
  const notified: string[] = [];
  for (const row of rows) {
    if (await sendWeeklyPrayedNote(row)) sent++;
    notified.push(row.prayerId);
  }
  await store.markNotified(notified);
  return NextResponse.json({ ok: true, digest: { candidates: rows.length, sent } });
}
