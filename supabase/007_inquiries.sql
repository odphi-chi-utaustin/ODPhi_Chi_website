-- Public form submissions: contact, alumni info updates, recruitment referrals.
-- Read and cleared from /portal/inbox. Run once in the SQL editor.

create table inquiries (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('contact', 'alumni_update', 'referral')),
  name        text not null,
  email       text not null default '',
  phone       text not null default '',
  -- Everything else the form collected, as label → value, in display order.
  fields      jsonb not null default '[]',
  handled_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index inquiries_open_idx on inquiries(handled_at, created_at desc);

-- RLS on, no policies: the forms insert and the portal reads through the server with the service role key.
alter table inquiries enable row level security;
