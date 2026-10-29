"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { donationFunds } from "@/lib/site";
import { parseDollars } from "@/lib/portal/format";
import { feeFor } from "@/lib/portal/fees";
import type { ActionState } from "@/lib/portal/actions";

const MIN_CENTS = 500;
const MAX_CENTS = 1_000_000;

// Public gift → Stripe Checkout. Nothing is stored here: gifts live in the Stripe dashboard.
// The webhook ignores these sessions because no charge row carries their id.
export async function startDonation(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const cents = parseDollars(String(formData.get("amount") ?? ""));
  if (!cents || cents < MIN_CENTS) return { error: "Enter an amount of at least $5." };
  if (cents > MAX_CENTS) return { error: "For gifts over $10,000, please contact the chapter directly." };

  const fund = donationFunds.find((f) => f.value === formData.get("fund")) ?? donationFunds[0];
  const coverFees = formData.get("cover_fees") === "on";
  const fee = coverFees ? feeFor(cents, "card") : 0;

  const line_items = [
    {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: cents,
        product_data: { name: `Gift to the Chi Chapter — ${fund.label}` },
      },
    },
  ];
  if (fee > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: fee,
        product_data: { name: "Processing fee (covered by donor)" },
      },
    });
  }

  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const metadata = { kind: "donation", fund: fund.value, fee_cents: String(fee) };

  let url: string | null;
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      line_items,
      metadata,
      payment_intent_data: { description: `Donation — ${fund.label}`, metadata },
      success_url: `${origin}/give?thanks=1`,
      cancel_url: `${origin}/give`,
    });
    url = session.url;
  } catch (err) {
    console.error("[donations] checkout failed:", err);
    url = null;
  }
  if (!url) return { error: "Online giving is unavailable right now. Please try again later." };
  redirect(url);
}
