import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Stripe → us. Not behind proxy.ts (no session); authenticated by signature only.
// Idempotent: every handler keys off the Checkout Session id already stored on the charges.
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new NextResponse("missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return new NextResponse("bad signature", { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.payment_status === "paid") {
        await markPaid(admin, session.id);
      } else {
        // ACH: debit initiated, funds not yet cleared.
        await admin
          .from("charges")
          .update({ pending_at: new Date().toISOString() })
          .eq("stripe_session_id", session.id)
          .is("paid_at", null);
      }
      break;
    }
    case "checkout.session.async_payment_succeeded":
      await markPaid(admin, event.data.object.id);
      break;
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired":
      await admin
        .from("charges")
        .update({ pending_at: null, stripe_session_id: null })
        .eq("stripe_session_id", event.data.object.id)
        .is("paid_at", null);
      break;
    case "charge.refunded": {
      // Full refund → charge is owed again. Partial refunds are left for exec to sort out.
      const charge = event.data.object;
      if (!charge.refunded || typeof charge.payment_intent !== "string") break;
      const sessions = await stripe().checkout.sessions.list({
        payment_intent: charge.payment_intent,
        limit: 1,
      });
      const sessionId = sessions.data[0]?.id;
      if (sessionId) {
        await admin
          .from("charges")
          .update({ paid_at: null, pending_at: null, stripe_session_id: null })
          .eq("stripe_session_id", sessionId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function markPaid(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  sessionId: string,
) {
  await admin
    .from("charges")
    .update({ paid_at: new Date().toISOString(), pending_at: null })
    .eq("stripe_session_id", sessionId)
    .is("paid_at", null);
}
