# Member Portal — MVP Plan

**Goal:** a member logs in and sees a list of charges with a total; an exec can add charges (to one
person or everyone) and tick them off as paid.

Decided 2026-09-20. This replaces the earlier ledger-based plan; nothing from it carries over.

---

## 1. Scope

**In**

- Member signs in (magic link) and sees total owed + the charges behind it + how to pay.
- Exec sees the roster with each member's balance.
- Exec adds a charge to one member, or to every active member at once (dues).
- Exec marks a charge paid, or deletes it.

**Out — deliberately**

Partial payments, audit history, announcements, events, alumni access, Stripe/online payment, custom
SMTP. None of these block "see what I owe."

**Unchanged:** the public site stays static — no database, no auth.

---

## 2. Data model — two tables

```
members
  id          uuid pk
  email       citext unique       -- the login gate
  name        text
  role        text                -- 'member' | 'exec'
  active      bool default true
  created_at  timestamptz

charges
  id            uuid pk
  member_id     uuid -> members (cascade)
  amount_cents  int                 -- $300.00 = 30000
  description   text                -- "Fall 2026 dues", "Missed chapter 9/8"
  paid_at       timestamptz null    -- null = owed
  created_at    timestamptz
```

- Dues and fines are the same thing: a charge. No `kind` column.
- Balance = `SUM(amount_cents) WHERE paid_at IS NULL`.
- Payment = exec sets `paid_at`. Forgiving a charge = exec deletes it.
- Bulk dues = one insert per active member. The description carries the term.
- No `auth_user_id`. On login, the member is looked up by email.

**Trade-off accepted:** no partial payments, no audit trail. If someone pays $150 of $300, exec deletes
the $300 charge and creates a $150 one. If this bites, that's the signal to add a ledger.

---

## 3. Auth

Supabase magic link with `signInWithOtp({ shouldCreateUser: false })`. Only emails that already have
an `auth.users` row get a link. Exec adds a member by inserting into `members` **and** calling
`auth.admin.inviteUserByEmail` from a server action — that's the only path that creates a login.

---

## 4. Security

- RLS is **enabled on both tables with zero policies**. The anon key can't read or write anything.
- All data access goes through server components / server actions using the **service role key**,
  which is server-only (`SUPABASE_SERVICE_ROLE_KEY`, never `NEXT_PUBLIC_`, never committed).
- Authorization is one helper, `lib/portal/auth.ts`: `requireMember()` and `requireExec()`. Every
  page and action calls one of them first.
- `proxy.ts` does an optimistic cookie check to bounce logged-out users from `/portal/*` to `/login`.
  It is not the security boundary; the helper is.

---

## 5. Pages & actions

| Route            | Who    | What                                                                          |
|------------------|--------|-------------------------------------------------------------------------------|
| `/login`         | anyone | email field → "check your inbox"                                              |
| `/auth/callback` | —      | exchanges the magic-link code for a session, redirects to `/portal`           |
| `/portal`        | member | total owed, list of charges, Venmo/Zelle blurb                                |
| `/portal/exec`   | exec   | roster with balances; add charge; charge all actives; mark paid / delete      |

Server actions: `sendMagicLink`, `signOut`, `addCharge`, `chargeAllActives`, `markPaid`,
`deleteCharge`, `addMember`.

---

## 6. Build order

1. **Supabase + schema** — `supabase/schema.sql` (tables, RLS on), `supabase/seed.sql` template,
   env vars. *(Manual: create the project, run the SQL, invite the roster.)*
2. **Auth + member view** — `/login`, callback, `proxy.ts`, `/portal`. Fixes the dead Login button
   in the nav. Shippable on its own if exec seeds charges in the Supabase dashboard.
3. **Exec view** — `/portal/exec`.

---

## 7. Notes for this Next.js version (16.2.9)

- `middleware.ts` is now `proxy.ts` (export `proxy`, Node runtime).
- `cookies()` and `headers()` are async — `await cookies()`.
- `revalidatePath` after mutations; `redirect()` throws, so call it last.
- Cache Components are not enabled; pages that read the DB are dynamic by default.

---

## 8. Open

- Real roster (names + emails) and the actual dues amount for the first bulk run.
- Venmo/Zelle handles for the "how to pay" blurb.
- Supabase's built-in email sender is rate-limited; fine for ~32 people, move to Resend if links go
  missing.
