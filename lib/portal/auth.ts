import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// member: sees own dues. exec: charges + edits non-admin members.
// admin: full roster (incl. admins, removal), sees money but can't charge.
// exec_admin: both.
export type Role = "member" | "exec" | "admin" | "exec_admin";

export const ROLE_LABELS: Record<Role, string> = {
  member: "Member",
  exec: "Exec",
  admin: "Admin",
  exec_admin: "Exec + Admin",
};

export type Member = {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
};

// The signed-in user's roster row, or null. Deduped per request.
export const getCurrentMember = cache(async (): Promise<Member | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("members")
    .select("id, email, name, role, active")
    .eq("email", user.email)
    .maybeSingle();

  return (data as Member | null) ?? null;
});

// Every portal page and action starts with one of these two.
export async function requireMember(): Promise<Member> {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  return member;
}

// Can open /portal/exec: exec, admin, or both.
export function isExec(member: Member) {
  return member.role !== "member";
}

// Can create, settle, or delete charges.
export function canCharge(member: Member) {
  return member.role === "exec" || member.role === "exec_admin";
}

// Full roster control: remove members, touch admins, grant any role.
export function isRosterAdmin(member: Member) {
  return member.role === "admin" || member.role === "exec_admin";
}

// Roles `by` may give someone. Plain exec can only hand out member or exec.
export function grantableRoles(by: Member): Role[] {
  return isRosterAdmin(by) ? ["member", "exec", "admin", "exec_admin"] : ["member", "exec"];
}

// Whether `by` may change `target`'s role, status, or password. Never yourself;
// plain exec can't touch anyone with admin powers.
export function canEditMember(by: Member, target: Pick<Member, "id" | "role">) {
  if (target.id === by.id || !isExec(by)) return false;
  return isRosterAdmin(by) || target.role === "member" || target.role === "exec";
}

// Any exec-page role.
export async function requireExec(): Promise<Member> {
  const member = await requireMember();
  if (!isExec(member)) redirect("/portal");
  return member;
}

// Exec or exec_admin: charges.
export async function requireCharger(): Promise<Member> {
  const member = await requireExec();
  if (!canCharge(member)) redirect("/portal/exec");
  return member;
}

// Admin or exec_admin: removing members.
export async function requireRosterAdmin(): Promise<Member> {
  const member = await requireExec();
  if (!isRosterAdmin(member)) redirect("/portal/exec");
  return member;
}
