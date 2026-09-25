-- Member portal schema. Run once in the Supabase SQL editor.
-- See PLAN.md §2 and §4.

create extension if not exists citext;

create table members (
  id          uuid primary key default gen_random_uuid(),
  email       citext not null unique,
  name        text not null,
  role        text not null default 'member' check (role in ('member', 'exec', 'admin', 'exec_admin')),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table charges (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid not null references members(id) on delete cascade,
  amount_cents  integer not null check (amount_cents > 0),
  description   text not null,
  paid_at       timestamptz,
  created_at    timestamptz not null default now()
);

create index charges_member_id_idx on charges(member_id);

-- RLS on, no policies: the anon/authenticated keys can't touch these tables.
-- All access goes through the server with the service role key (lib/portal/auth.ts).
alter table members enable row level security;
alter table charges enable row level security;
