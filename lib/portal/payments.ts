"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireMember } from "@/lib/portal/auth";
import { passFeesToPayer } from "@/lib/portal/config";
import { feeFor, type PayMethod } from "@/lib/portal/fees";

// Starts a Stripe Checkout for one charge (form field `charge_id`) or every
// outstanding charge (no field), by `method` ("bank" = ACH, clears in ~4
// business days; "card" = instant). Locking the method lets the fee line match.
export async function startCheckout(formData: FormData) {
  const member = await requireMember();
  const chargeId = String(formData.get("charge_id") ?? "").trim();
  const method: PayMethod = formData.get("method") === "card" ? "card" : "bank";

  const admin = createSupabaseAdminClient();
  let query = admin
    .from("charges")
    .select("id, amount_cents, description")
    .eq("member_id", member.id)
    .is("paid_at", null)
    .is("pending_at", null);
  if (chargeId) query = query.eq("id", chargeId);

  const { data: charges, error } = await query;
  if (error) throw error;
  if (!charges?.length) redirect("/portal");

  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("x-forwarded-host") ?? h.get("host")}`;

  const subtotal = charges.reduce((s, c) => s + c.amount_cents, 0);
  const fee = passFeesToPayer ? feeFor(subtotal, method) : 0;

  const line_items = charges.map((c) => ({
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: c.amount_cents,
      product_data: { name: c.description },
    },
  }));
  if (fee > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: fee,
        product_data: { name: `Processing fee (${method === "bank" ? "bank transfer" : "card"})` },
      },
    });
  }

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: member.email,
    payment_method_types: [method === "bank" ? "us_bank_account" : "card"],
    line_items,
    metadata: {
      member_id: member.id,
      charge_ids: charges.map((c) => c.id).join(","),
      fee_cents: String(fee),
    },
    success_url: `${origin}/portal?paid=1`,
    cancel_url: `${origin}/portal?canceled=1`,
  });

  // Tag the charges now so a webhook that races the redirect still finds them.
  await admin
    .from("charges")
    .update({ stripe_session_id: session.id })
    .in("id", charges.map((c) => c.id));

  redirect(session.url!);
}
