"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireMember, requireExec, requireAdmin, type Member } from "@/lib/portal/auth";
import { parseDollars } from "@/lib/portal/format";
import { newChargeEmail, sendEmails } from "@/lib/portal/email";
import { lockedMinutes, recordFailure, clearFailures } from "@/lib/portal/lockout";

export type ActionState = { error?: string; success?: string } | undefined;

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

// Parses a role from a form, capped by what the caller is allowed to grant:
// only admins can grant admin.
function roleFrom(formData: FormData, by: Member): Member["role"] {
  const r = str(formData, "role");
  if (r === "admin") return by.role === "admin" ? "admin" : "exec";
  return r === "exec" ? "exec" : "member";
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

export async function signInWithPassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = str(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email.includes("@")) return { error: "Enter your email address." };
  if (!password) return { error: "Enter your password, or use a sign-in link instead." };

  const minutes = await lockedMinutes(email);
  if (minutes) {
    return {
      error: `Too many wrong passwords. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}, or use an email link.`,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    await recordFailure(email);
    return { error: "Wrong email or password." };
  }
  await clearFailures(email);
  redirect("/portal");
}

// One form, two buttons: the pressed button's `intent` picks the method.
export async function signIn(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return formData.get("intent") === "link"
    ? sendMagicLink(prev, formData)
    : signInWithPassword(prev, formData);
}

// Signed-in member sets or changes their own password.
export async function setPassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireMember();
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Use at least 8 characters." };
  if (password !== String(formData.get("confirm") ?? "")) {
    return { error: "Passwords don't match." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { success: "Password saved. You can now sign in with it at /login." };
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
  const me = await requireExec();
  const email = str(formData, "email").toLowerCase();
  const name = str(formData, "name");
  const role = roleFrom(formData, me);
  const password = String(formData.get("password") ?? "");
  if (!email.includes("@")) return { error: "Enter a valid email." };
  if (!name) return { error: "Enter a name." };
  if (password && password.length < 8) return { error: "Temporary password needs at least 8 characters." };

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("members").insert({ email, name, role });
  if (error) {
    return { error: error.code === "23505" ? "That email is already on the roster." : error.message };
  }

  // Creates the auth.users row so the member can request a magic link from /login,
  // or sign in with the optional temporary password.
  // No invite email: editing Supabase's templates requires custom SMTP.
  const { error: authErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    ...(password && { password }),
  });
  if (authErr && !/already been registered|already exists/i.test(authErr.message)) {
    return { error: `Added to roster, but login setup failed: ${authErr.message}` };
  }

  revalidatePath("/portal", "layout");
  return { success: `${name} added. Tell them to sign in at /login.` };
}

// Change a member's role. Nobody can change their own role, admins can only be
// changed by admins, and only admins can grant admin.
export async function setMemberRole(formData: FormData) {
  const me = await requireExec();
  const id = str(formData, "id");
  if (id === me.id) return;
  const role = roleFrom(formData, me);

  const admin = createSupabaseAdminClient();
  const { data: target } = await admin.from("members").select("role").eq("id", id).maybeSingle();
  if (!target) return;
  if (target.role === "admin" && me.role !== "admin") return;

  await admin.from("members").update({ role }).eq("id", id);
  revalidatePath("/portal", "layout");
}

// Admin only. Deletes the roster row (charges cascade) and the login, so the
// address can no longer request a magic link. Not reversible.
export async function removeMember(formData: FormData) {
  const me = await requireAdmin();
  const id = str(formData, "id");
  if (!id || id === me.id) return;

  const admin = createSupabaseAdminClient();
  const { data: target } = await admin.from("members").select("email").eq("id", id).maybeSingle();
  if (!target) return;

  await admin.from("members").delete().eq("id", id);

  const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const authUser = users?.users.find((u) => u.email?.toLowerCase() === target.email.toLowerCase());
  if (authUser) await admin.auth.admin.deleteUser(authUser.id);

  revalidatePath("/portal", "layout");
}

// Exec sets a temporary password for someone already on the roster (no password
// yet, or forgot it). Creates their login if they were seeded without one, and
// clears any lockout. Your own password is changed from /portal instead.
export async function setMemberPassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const me = await requireExec();
  const id = str(formData, "member_id");
  const password = String(formData.get("password") ?? "");
  if (!id) return { error: "Pick a member." };
  if (id === me.id) return { error: "Change your own password from the My Dues page." };
  if (password.length < 8) return { error: "Use at least 8 characters." };

  const admin = createSupabaseAdminClient();
  const { data: target } = await admin
    .from("members")
    .select("email, name, role")
    .eq("id", id)
    .maybeSingle();
  if (!target) return { error: "That member isn't on the roster." };
  if (target.role === "admin" && me.role !== "admin") {
    return { error: "Only an admin can reset an admin's password." };
  }

  const email = target.email.toLowerCase();
  const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const authUser = users?.users.find((u) => u.email?.toLowerCase() === email);
  const { error } = authUser
    ? await admin.auth.admin.updateUserById(authUser.id, { password })
    : await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) return { error: error.message };

  await clearFailures(email);
  return { success: `Password set for ${target.name}. Send it to them privately.` };
}

export async function setMemberActive(formData: FormData) {
  await requireExec();
  const id = str(formData, "id");
  const active = str(formData, "active") === "true";
  const admin = createSupabaseAdminClient();
  await admin.from("members").update({ active }).eq("id", id);
  revalidatePath("/portal", "layout");
}
