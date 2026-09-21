"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireExec } from "@/lib/portal/auth";
import { parseDollars } from "@/lib/portal/format";
import { newChargeEmail, sendEmails } from "@/lib/portal/email";

export type ActionState = { error?: string; success?: string } | undefined;

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function siteUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

// Emails each member their new charge(s) and current balance. Best effort.
async function notifyNewCharges(
  memberIds: string[],
  charge: { description: string; amount_cents: number },
) {
  if (!process.env.RESEND_API_KEY) return;
  const admin = createSupabaseAdminClient();
  const [membersRes, owedRes] = await Promise.all([
    admin.from("members").select("id, name, email").in("id", memberIds),
    admin.from("charges").select("member_id, amount_cents").in("member_id", memberIds).is("paid_at", null),
  ]);
  if (membersRes.error || owedRes.error) return;
  const balance = new Map<string, number>();
  for (const c of owedRes.data) balance.set(c.member_id, (balance.get(c.member_id) ?? 0) + c.amount_cents);
  const portalUrl = `${await siteUrl()}/portal`;
  await sendEmails(
    membersRes.data.map((m) => newChargeEmail(m, [charge], balance.get(m.id) ?? 0, portalUrl)),
  );
}

// ---- auth ----

export async function sendMagicLink(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = str(formData, "email").toLowerCase();
  if (!email.includes("@")) return { error: "Enter your email address." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${await siteUrl()}/auth/callback`,
    },
  });

  // Don't reveal whether the address is on the roster.
  if (error && !/signups not allowed/i.test(error.message)) {
    return { error: "Couldn't send a link right now. Try again in a minute." };
  }
  return { success: "If that email is on the roster, a sign-in link is on its way." };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ---- exec: charges ----

export async function addCharge(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireExec();
  const member_id = str(formData, "member_id");
  const description = str(formData, "description");
  const amount_cents = parseDollars(str(formData, "amount"));
  if (!member_id) return { error: "Pick a member." };
  if (!description) return { error: "Add a description." };
  if (!amount_cents) return { error: "Amount must be a positive dollar value." };

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("charges")
    .insert({ member_id, description, amount_cents });
  if (error) return { error: error.message };

  await notifyNewCharges([member_id], { description, amount_cents });
  revalidatePath("/portal", "layout");
  return { success: "Charge added." };
}

export async function chargeAllActives(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireExec();
  const description = str(formData, "description");
  const amount_cents = parseDollars(str(formData, "amount"));
  if (!description) return { error: "Add a description (e.g. “Fall 2026 dues”)." };
  if (!amount_cents) return { error: "Amount must be a positive dollar value." };

  const admin = createSupabaseAdminClient();
  const { data: actives, error: mErr } = await admin
    .from("members")
    .select("id")
    .eq("active", true);
  if (mErr) return { error: mErr.message };
  if (!actives.length) return { error: "No active members to charge." };

  const { error } = await admin.from("charges").insert(
    actives.map((m) => ({ member_id: m.id, description, amount_cents })),
  );
  if (error) return { error: error.message };

  await notifyNewCharges(actives.map((m) => m.id), { description, amount_cents });
  revalidatePath("/portal", "layout");
  return { success: `Charged ${actives.length} active member${actives.length === 1 ? "" : "s"}.` };
}

export async function markPaid(formData: FormData) {
  await requireExec();
  const id = str(formData, "id");
  const admin = createSupabaseAdminClient();
  await admin
    .from("charges")
    .update({ paid_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/portal", "layout");
}

export async function markUnpaid(formData: FormData) {
  await requireExec();
  const id = str(formData, "id");
  const admin = createSupabaseAdminClient();
  await admin.from("charges").update({ paid_at: null }).eq("id", id);
  revalidatePath("/portal", "layout");
}

export async function deleteCharge(formData: FormData) {
  await requireExec();
  const id = str(formData, "id");
  const admin = createSupabaseAdminClient();
  await admin.from("charges").delete().eq("id", id);
  revalidatePath("/portal", "layout");
}

// ---- exec: roster ----

export async function addMember(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireExec();
  const email = str(formData, "email").toLowerCase();
  const name = str(formData, "name");
  const role = str(formData, "role") === "exec" ? "exec" : "member";
  if (!email.includes("@")) return { error: "Enter a valid email." };
  if (!name) return { error: "Enter a name." };

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("members").insert({ email, name, role });
  if (error) {
    return { error: error.code === "23505" ? "That email is already on the roster." : error.message };
  }

  // Creates the auth.users row so the member can request a magic link from /login.
  // No invite email: editing Supabase's templates requires custom SMTP.
  const { error: authErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (authErr && !/already been registered|already exists/i.test(authErr.message)) {
    return { error: `Added to roster, but login setup failed: ${authErr.message}` };
  }

  revalidatePath("/portal", "layout");
  return { success: `${name} added. Tell them to sign in at /login.` };
}

// Promote to exec or demote to member. An exec can't demote themselves, so the
// chapter can never end up with zero execs by accident.
export async function setMemberRole(formData: FormData) {
  const me = await requireExec();
  const id = str(formData, "id");
  const role = str(formData, "role") === "exec" ? "exec" : "member";
  if (id === me.id && role !== "exec") return;
  const admin = createSupabaseAdminClient();
  await admin.from("members").update({ role }).eq("id", id);
  revalidatePath("/portal", "layout");
}

export async function setMemberActive(formData: FormData) {
  await requireExec();
  const id = str(formData, "id");
  const active = str(formData, "active") === "true";
  const admin = createSupabaseAdminClient();
  await admin.from("members").update({ active }).eq("id", id);
  revalidatePath("/portal", "layout");
}
