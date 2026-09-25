-- Failed password sign-ins, for the lockout in lib/portal/lockout.ts.
-- Run once in the SQL editor.

create table login_attempts (
  email         citext primary key,
  failures      integer not null default 0,
  last_failure  timestamptz,
  locked_until  timestamptz
);

-- RLS on, no policies: only the server (service role key) reads or writes this.
alter table login_attempts enable row level security;
