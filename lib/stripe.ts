import Stripe from "stripe";

// Server only. Lazy so pages that never touch Stripe don't need the key at build time.
let client: Stripe | null = null;

export function stripe() {
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return client;
}
