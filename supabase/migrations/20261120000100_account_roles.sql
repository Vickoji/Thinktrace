-- Authentication data stays in auth.users. No study enrollment occurs at signup.
create table public.account_roles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    role text not null default 'participant' check (role in ('participant', 'researcher'))
);

alter table public.account_roles enable row level security;
revoke all privileges on public.account_roles from public, anon, authenticated;
grant select on public.account_roles to authenticated;

create policy read_own_role on public.account_roles for select to authenticated
using (user_id = (select auth.uid()));

create schema if not exists private;
create function private.create_account_role() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
    insert into public.account_roles (user_id) values (new.id);
    return new;
end;
$$;
revoke all on function private.create_account_role() from public, anon, authenticated;

create trigger provision_account_role after insert on auth.users
for each row execute function private.create_account_role();

-- Also provision accounts that were created before this migration.
insert into public.account_roles (user_id)
select id from auth.users on conflict (user_id) do nothing;
