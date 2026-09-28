"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/admin-auth";
import { isCategory, LIMITS } from "@/lib/constants";
import { getStore } from "@/lib/store";
import type { Status } from "@/lib/types";
import { clean, cleanName, isUuid } from "@/lib/validate";

const STATUSES: Status[] = ["pending", "approved", "hidden"];

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/prayer-wall");
  revalidatePath("/prayer-wall/[id]", "page");
  revalidatePath("/answered");
  revalidatePath("/admin");
}

function idFrom(formData: FormData): string {
  const id = formData.get("id");
  if (!isUuid(id)) throw new Error("Invalid id");
  return id;
}

export async function login(_prev: { error: string } | null, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 1000)); // slow down guessing
    return { error: "That password is not right. Please try again." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function setPrayerStatus(formData: FormData) {
  await requireAdmin();
  const status = formData.get("status") as Status;
  if (!STATUSES.includes(status)) throw new Error("Invalid status");
  await getStore().adminUpdatePrayer(idFrom(formData), { status });
  refreshPublicPages();
}

export async function savePrayer(formData: FormData) {
  await requireAdmin();
  const request = clean(formData.get("request"), LIMITS.request);
  if (request.length < 3) throw new Error("Request is too short");
  const category = formData.get("category");
  await getStore().adminUpdatePrayer(idFrom(formData), {
    name: cleanName(formData.get("name"), LIMITS.name),
    request,
    category: isCategory(category) ? category : null,
    flagged: formData.get("flagged") === "on",
  });
  refreshPublicPages();
}

export async function deletePrayer(formData: FormData) {
  await requireAdmin();
  await getStore().adminDeletePrayer(idFrom(formData));
  refreshPublicPages();
}

export async function setTestimonyStatus(formData: FormData) {
  await requireAdmin();
  const status = formData.get("status") as Status;
  if (!STATUSES.includes(status)) throw new Error("Invalid status");
  await getStore().adminUpdateTestimony(idFrom(formData), { status });
  refreshPublicPages();
}

export async function saveTestimony(formData: FormData) {
  await requireAdmin();
  const prayedFor = clean(formData.get("prayedFor"), LIMITS.prayedFor);
  const answer = clean(formData.get("answer"), LIMITS.answer);
  if (prayedFor.length < 3 || answer.length < 3) throw new Error("Text is too short");
  await getStore().adminUpdateTestimony(idFrom(formData), {
    name: cleanName(formData.get("name"), LIMITS.name),
    prayedFor,
    answer,
    flagged: formData.get("flagged") === "on",
  });
  refreshPublicPages();
}

export async function deleteTestimony(formData: FormData) {
  await requireAdmin();
  await getStore().adminDeleteTestimony(idFrom(formData));
  refreshPublicPages();
}

export async function markMessage(formData: FormData) {
  await requireAdmin();
  await getStore().adminMarkMessage(idFrom(formData), formData.get("read") === "true");
  revalidatePath("/admin");
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  await getStore().adminDeleteMessage(idFrom(formData));
  revalidatePath("/admin");
}
