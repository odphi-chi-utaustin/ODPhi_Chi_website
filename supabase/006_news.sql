-- News posts, edited from /portal/news. Run once in the SQL editor.

create table news_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  type          text not null default 'general' check (type in ('spotlight', 'newsletter', 'general')),
  title         text not null,
  excerpt       text not null default '',
  content       text not null default '',
  author        text not null default '',
  image_url     text,
  published     boolean not null default false,
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index news_posts_published_idx on news_posts(published, published_at desc);

-- RLS on, no policies: the public pages read through the server with the service role key.
alter table news_posts enable row level security;

-- Public bucket for post photos. Uploads go through the server; anyone can view.
insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do nothing;
