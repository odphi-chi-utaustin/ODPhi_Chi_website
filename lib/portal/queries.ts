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

export type MemberWithBalance = Member & {
  balance_cents: number;
  last_sign_in_at: string | null; // null = has never completed a magic-link sign-in
};

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
    .filter((c) => !c.paid_at)
    .reduce((sum, c) => sum + c.amount_cents, 0);
}

// email (lowercased) -> last_sign_in_at from auth.users. Paginates; the roster is small.
async function getLastSignIns(admin: ReturnType<typeof createSupabaseAdminClient>) {
  const map = new Map<string, string | null>();
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    for (const u of data.users) {
      if (u.email) map.set(u.email.toLowerCase(), u.last_sign_in_at ?? null);
    }
    if (data.users.length < 200) break;
  }
  return map;
}

// Roster with each member's unpaid total and whether they've ever signed in.
export async function getRosterWithBalances(): Promise<MemberWithBalance[]> {
  const admin = createSupabaseAdminClient();
  const [membersRes, chargesRes, signIns] = await Promise.all([
    admin.from("members").select("id, email, name, role, active").order("name"),
    admin.from("charges").select("member_id, amount_cents").is("paid_at", null),
    getLastSignIns(admin),
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
    last_sign_in_at: signIns.get(m.email.toLowerCase()) ?? null,
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
