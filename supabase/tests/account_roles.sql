-- Run inside a disposable Supabase development database with supabase test db.
begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;
select plan(10);

insert into auth.users (id, raw_user_meta_data) values
('00000000-0000-4000-a000-000000000001', '{"role":"researcher"}'),
('00000000-0000-4000-a000-000000000002', '{}');

select is((select role from public.account_roles where user_id = '00000000-0000-4000-a000-000000000001'),
          'participant', 'signup cannot grant a researcher role from user metadata');
update public.account_roles set role = 'researcher' where user_id = '00000000-0000-4000-a000-000000000002';

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-4000-a000-000000000001';
select is((select count(*) from public.account_roles), 1::bigint, 'only one own row is visible');
select is((select role from public.account_roles), 'participant', 'participant sees own role');
select throws_ok($$update public.account_roles set role = 'researcher'$$, '42501',
                 'permission denied for table account_roles', 'cannot promote self');
select throws_ok($$delete from public.account_roles$$, '42501',
                 'permission denied for table account_roles', 'cannot remove roles');
select throws_ok($$insert into public.account_roles(user_id) values (gen_random_uuid())$$, '42501',
                 'permission denied for table account_roles', 'cannot insert roles');

set local request.jwt.claim.sub = '00000000-0000-4000-a000-000000000002';
select is((select role from public.account_roles), 'researcher', 'researcher sees own assigned role');
select is((select count(*) from public.account_roles), 1::bigint, 'researcher cannot list other accounts');

set local role anon;
select throws_ok($$select * from public.account_roles$$, '42501',
                 'permission denied for table account_roles', 'signed-out role cannot read account roles');
reset role;
delete from auth.users where id = '00000000-0000-4000-a000-000000000002';
select is((select count(*) from public.account_roles where user_id = '00000000-0000-4000-a000-000000000002'),
          0::bigint, 'account deletion removes the role');
select * from finish();
rollback;
