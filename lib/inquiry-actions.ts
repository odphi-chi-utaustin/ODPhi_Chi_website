"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireExec } from "@/lib/portal/auth";
import { emailFrom } from "@/lib/portal/config";
import { sendEmails } from "@/lib/portal/email";
import { inquiryNotifyEmail } from "@/lib/site";
import { INQUIRY_FIELDS, INQUIRY_LABELS, type InquiryKind } from "@/lib/inquiries";
import type { ActionState } from "@/lib/portal/actions";

// Generous enough for a real message, small enough that nobody stuffs the table.
const MAX_FIELD = 4000;

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim().slice(0, MAX_FIELD);
}

// Public, so no auth. A hidden "website" field catches form-filling bots: humans never see it.
async function submit(
  kind: InquiryKind,
  formData: FormData,
  required: [string, string][],
  success: string,
): Promise<ActionState> {
  if (str(formData, "website")) return { success };

  for (const [key, label] of required) {
    if (!str(formData, key)) return { error: `${label} is required.` };
  }
  const email = str(formData, "email").toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const row = {
    kind,
    name: str(formData, "name"),
    email,
    phone: str(formData, "phone"),
    fields: INQUIRY_FIELDS[kind]
      .map(([key, label]) => ({ label, value: str(formData, key) }))
      .filter((f) => f.value),
  };

  const { error } = await createSupabaseAdminClient().from("inquiries").insert(row);
  if (error) {
    console.error("[inquiries] insert failed:", error.message);
    return { error: "Something went wrong sending that. Please try again in a minute." };
  }

  if (inquiryNotifyEmail) {
    await sendEmails([
      {
        from: emailFrom,
        to: inquiryNotifyEmail,
        replyTo: row.email || undefined,
        subject: `${INQUIRY_LABELS[kind]}: ${row.name}`,
        text: [
          `Name: ${row.name}`,
          row.email && `Email: ${row.email}`,
          row.phone && `Phone: ${row.phone}`,
          ...row.fields.map((f) => `${f.label}: ${f.value}`),
          "",
          "Also in the portal inbox: /portal/inbox",
        ]
          .filter((line) => line !== "")
          .join("\n"),
      },
    ]);
  }

  revalidatePath("/portal/inbox");
  return { success };
}

export async function submitContact(_prev: ActionState, formData: FormData) {
  return submit(
    "contact",
    formData,
    [["name", "Name"], ["email", "Email"], ["message", "Message"]],
    "Thanks — your message is in. A brother will get back to you soon.",
  );
}

export async function submitAlumniUpdate(_prev: ActionState, formData: FormData) {
  return submit(
    "alumni_update",
    formData,
    [["name", "Name"], ["email", "Email"]],
    "Thanks — your information is updated with the chapter.",
  );
}

export async function submitReferral(_prev: ActionState, formData: FormData) {
  return submit(
    "referral",
    formData,
    [["name", "Your name"], ["email", "Your email"], ["candidate_name", "Candidate name"]],
    "Thanks for the recommendation — our rush chair will reach out to him.",
  );
}

// ---- portal inbox (exec only) ----

export async function setInquiryHandled(formData: FormData) {
  await requireExec();
  const id = String(formData.get("id") ?? "");
  const handled = formData.get("handled") === "true";
  await createSupabaseAdminClient()
    .from("inquiries")
    .update({ handled_at: handled ? new Date().toISOString() : null })
    .eq("id", id);
  revalidatePath("/portal/inbox");
}

export async function deleteInquiry(formData: FormData) {
  await requireExec();
  const id = String(formData.get("id") ?? "");
  await createSupabaseAdminClient().from("inquiries").delete().eq("id", id);
  revalidatePath("/portal/inbox");
}
