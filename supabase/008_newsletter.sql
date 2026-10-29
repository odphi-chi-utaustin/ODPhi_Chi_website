-- Newsletter mailing list and sent issues, managed from /portal/newsletter. Run once in the SQL editor.

create table newsletter_subscribers (
  id               uuid primary key default gen_random_uuid(),
  email            text not null unique,
  name             text not null default '',
  -- Secret per subscriber; goes in every email's unsubscribe link.
  token            uuid not null unique default gen_random_uuid(),
  source           text not null default '',
  subscribed_at    timestamptz not null default now(),
  unsubscribed_at  timestamptz
);

create table newsletter_issues (
  id               uuid primary key default gen_random_uuid(),
  subject          text not null,
  body             text not null,
  sent_by          text not null default '',
  recipient_count  integer not null default 0,
  news_slug        text,
  sent_at          timestamptz not null default now()
);

-- RLS on, no policies: everything goes through the server with the service role key.
alter table newsletter_subscribers enable row level security;
alter table newsletter_issues enable row level security;
