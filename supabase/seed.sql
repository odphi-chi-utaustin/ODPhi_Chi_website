-- Roster seed. Fill in real names/emails, then run in the SQL editor after schema.sql.
-- Inserting here creates the roster row only. A member can't log in until they've also been
-- invited (Auth > Users > Invite, or the "Add member" form on /portal/exec which does both).

insert into members (email, name, role) values
  ('rojasdamiancarlos@gmail.com', 'Carlos Rojas', 'admin')
  -- ('brother@utexas.edu', 'First Last', 'member'),
;
