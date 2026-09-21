-- Stripe online payment. Run once in the SQL editor after schema.sql.

alter table charges
  add column stripe_session_id text,          -- Checkout Session that paid (or is paying) this charge
  add column pending_at        timestamptz;   -- set while an ACH debit is clearing; null otherwise

create index charges_stripe_session_id_idx on charges(stripe_session_id);
