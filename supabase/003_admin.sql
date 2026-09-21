-- Website admin role: everything exec can do, plus removing members and granting admin.
-- Run once in the SQL editor.

alter table members drop constraint members_role_check;
alter table members add constraint members_role_check check (role in ('member', 'exec', 'admin'));

update members set role = 'admin' where email = 'rojasdamiancarlos@gmail.com';
