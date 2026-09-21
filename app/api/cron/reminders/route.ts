import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { reminderEmail, sendEmails } from "@/lib/portal/email";

// Weekly reminder to everyone with an outstanding balance. Triggered by the
// Vercel cron in vercel.json; Vercel sends `Authorization: Bearer $CRON_SECRET`.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("unauthorized", { status: 401 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ sent: 0, reason: "RESEND_API_KEY not set" });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("charges")
    .select("member_id, description, amount_cents, members(name, email, active)")
    .is("paid_at", null)
    .is("pending_at", null);
  if (error) return new NextResponse(error.message, { status: 500 });

  type Row = {
    member_id: string;
    description: string;
    amount_cents: number;
    members: { name: string; email: string; active: boolean } | null;
  };
  const byMember = new Map<string, { to: { name: string; email: string }; charges: Row[] }>();
  for (const row of data as unknown as Row[]) {
    if (!row.members?.active) continue;
    const entry = byMember.get(row.member_id) ?? { to: row.members, charges: [] };
    entry.charges.push(row);
    byMember.set(row.member_id, entry);
  }

  const portalUrl = `${new URL(request.url).origin}/portal`;
  const sent = await sendEmails(
    [...byMember.values()].map(({ to, charges }) =>
      reminderEmail(
        to,
        charges,
        charges.reduce((s, c) => s + c.amount_cents, 0),
        portalUrl,
      ),
    ),
  );

  return NextResponse.json({ sent, members: byMember.size });
}
