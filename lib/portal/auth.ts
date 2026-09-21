import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type Member = {
  id: string;
  email: string;
  name: string;
  role: "member" | "exec" | "admin";
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

export function isExec(member: Member) {
  return member.role === "exec" || member.role === "admin";
}

// Exec or admin.
export async function requireExec(): Promise<Member> {
  const member = await requireMember();
  if (!isExec(member)) redirect("/portal");
  return member;
}

// Admin only: removing members, granting/revoking admin.
export async function requireAdmin(): Promise<Member> {
  const member = await requireMember();
  if (member.role !== "admin") redirect("/portal/exec");
  return member;
}
