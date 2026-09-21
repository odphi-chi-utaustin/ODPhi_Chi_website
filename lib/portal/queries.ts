import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Member } from "@/lib/portal/auth";

export type Charge = {
  id: string;
  member_id: string;
  amount_cents: number;
  description: string;
  paid_at: string | null;
  pending_at: string | null;
  stripe_session_id: string | null;
  created_at: string;
};

export type MemberWithBalance = Member & { balance_cents: number };

export async function getChargesForMember(memberId: string): Promise<Charge[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("charges")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Charge[];
}

export function balanceOf(charges: Pick<Charge, "amount_cents" | "paid_at">[]) {
  return charges
    .filter((c) => c.paid_at === null)
    .reduce((sum, c) => sum + c.amount_cents, 0);
}

// Roster with each member's unpaid total, execs first then alphabetical.
export async function getRosterWithBalances(): Promise<MemberWithBalance[]> {
  const admin = createSupabaseAdminClient();
  const [membersRes, chargesRes] = await Promise.all([
    admin.from("members").select("id, email, name, role, active").order("name"),
    admin.from("charges").select("member_id, amount_cents").is("paid_at", null),
  ]);
  if (membersRes.error) throw membersRes.error;
  if (chargesRes.error) throw chargesRes.error;

  const owed = new Map<string, number>();
  for (const c of chargesRes.data) {
    owed.set(c.member_id, (owed.get(c.member_id) ?? 0) + c.amount_cents);
  }

  return (membersRes.data as Member[]).map((m) => ({
    ...m,
    balance_cents: owed.get(m.id) ?? 0,
  }));
}

export async function getAllCharges(): Promise<(Charge & { member_name: string })[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("charges")
    .select("*, members(name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as (Charge & { members: { name: string } | null })[]).map(
    ({ members, ...c }) => ({ ...c, member_name: members?.name ?? "—" }),
  );
}
