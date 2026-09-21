# Supabase setup (one-time)

1. Create a project at supabase.com. Copy the URL, anon key, and service role key from
   **Project Settings → API** into `.env.local` (see `.env.example`) and into Vercel env vars.
2. **SQL Editor** → run `schema.sql`, then `seed.sql` (edit the roster first).
3. **Authentication → URL Configuration**: set Site URL to the production URL and add
   `http://localhost:3000/auth/callback` and `https://<prod>/auth/callback` to Redirect URLs.
4. **Authentication → Users → Add user → Create new user**: enter your email (the exec row in
   `seed.sql`), tick **Auto Confirm User**, and set any password (it's never used). Don't use
   "Send invitation" — editing invite/magic-link templates requires custom SMTP, so the app skips
   invite emails entirely.
5. Go to `/login`, request a link, open it **on the same device**. After that, add everyone else
   through the "Add member" form on `/portal/exec`, which creates the roster row and the login in
   one step; they then sign themselves in at `/login`.

Sign-in links must be opened on the device that requested them (PKCE). The login page says so if a
link fails.

# Stripe setup (one-time, after the chapter account exists)

1. Run `002_stripe.sql` in the SQL editor.
2. **Stripe → Settings → Payment methods**: turn on **ACH Direct Debit** (0.8% capped at $5) so it's
   offered next to cards (2.9% + 30¢).
3. **Developers → API keys**: copy the **Secret key** into `STRIPE_SECRET_KEY` (Vercel: secret;
   `.env.local` for dev). Use the test-mode key until the bank account is verified.
4. **Developers → Webhooks → Add endpoint**: URL `https://<vercel-url>/api/stripe/webhook`. Select
   these events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
   - `charge.refunded`

   Copy the endpoint's **Signing secret** into `STRIPE_WEBHOOK_SECRET`. Redeploy.
5. Local dev: `stripe listen --forward-to localhost:3000/api/stripe/webhook` prints a `whsec_…` for
   `.env.local`. Test card `4242 4242 4242 4242`; test ACH uses Stripe's test bank in Checkout.

The Pay buttons only render when `STRIPE_SECRET_KEY` is set, so the portal works without Stripe.
Exec still marks Venmo/Zelle payments by hand; Stripe is just another way `paid_at` gets set.

# Email notifications (optional)

Members get an email when a charge is added, and a reminder every Monday while they owe anything.
Nothing sends until `RESEND_API_KEY` is set.

1. Create a free account at resend.com → **API Keys** → copy into `RESEND_API_KEY` (Vercel: secret).
2. Without a verified domain, Resend only delivers to the account owner's own email — fine for
   testing. For the roster, **Domains → Add domain**, add the DNS records it shows, then set
   `emailFrom` in `lib/portal/config.ts` to an address on that domain (e.g. `dues@<domain>`).
3. Set `CRON_SECRET` in Vercel to any long random string. Vercel's cron (see `vercel.json`) sends it
   as a Bearer token; the route rejects anything else. Hobby plan crons run once a day at most, so
   the weekly schedule is fine.
4. To test the reminder by hand:
   `curl -H "Authorization: Bearer $CRON_SECRET" https://<vercel-url>/api/cron/reminders`
