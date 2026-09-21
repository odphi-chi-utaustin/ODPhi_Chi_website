# Custom domain

Decided 2026-09-21. Not bought yet.

## Where to buy

**Cloudflare Registrar** (or Porkbun). At-cost pricing (`.org` ≈ $10–11/yr), no renewal hikes, free
WHOIS privacy. Not through Vercel: it's pricier and ties the domain to whoever's Vercel account the
site lives in. Avoid GoDaddy and Squarespace.

## Before buying

- **Check `scarletknights.org` first.** UT SFL still lists it as the chapter site (a 2016 WordPress).
  Someone in chapter history owns it; if the login can be recovered, renewing it keeps existing links.
- **Register under a chapter account**, not a personal one — a chapter Gmail with 2FA, credentials
  stored where the next exec board can find them. Same for the Vercel and Supabase accounts.
- Candidates if registering fresh: `odphichi.org`, `texasodphi.org`, `utodphi.org`. Nationals use
  `omegadeltaphi.org`, so `.org` fits.

## After buying (~15 minutes)

1. Vercel → project → Settings → Domains → add `<domain>` and `www.<domain>`. Vercel shows the
   records: `A 76.76.21.21` for the root, `CNAME cname.vercel-dns.com` for `www`.
2. Add those records at the registrar. On Cloudflare, set them to **DNS only** (grey cloud), not
   proxied.
3. Vercel issues the TLS certificate automatically.
4. Update everything that references the site URL:
   - Supabase → Authentication → URL Configuration: Site URL and Redirect URLs
     (`https://<domain>/auth/callback`)
   - Stripe → Developers → Webhooks: endpoint URL → `https://<domain>/api/stripe/webhook`
   - Resend → Domains → add `<domain>`, add its DNS records, then set `emailFrom` in
     `lib/portal/config.ts` to `dues@<domain>` — this is what unblocks email to the whole roster
   - UT SFL Chapter Leadership Roster Portal: update the "Local Website" field; tell LPHC marketing
