-- Split exec and admin: exec charges people and edits non-admin members; admin manages the
-- whole roster but can't charge; exec_admin does both. Run once in the SQL editor.

alter table members drop constraint members_role_check;
alter table members add constraint members_role_check
  check (role in ('member', 'exec', 'admin', 'exec_admin'));

-- Admin used to include everything exec could do. Keep that for the site owner.
update members set role = 'exec_admin' where email = 'rojasdamiancarlos@gmail.com';
