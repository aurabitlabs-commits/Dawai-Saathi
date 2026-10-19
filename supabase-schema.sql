-- Dawai Saathi: Supabase authentication + multi-caregiver/multi-elder mapping
create extension if not exists pgcrypto;

create table if not exists public.elders (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 120),
  invite_code text not null unique default upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 8)),
  created_at timestamptz not null default now()
);
create table if not exists public.caregiver_elder_links (
  id uuid primary key default gen_random_uuid(),
  caregiver_user_id uuid not null references auth.users(id) on delete cascade,
  elder_id uuid not null references public.elders(id) on delete cascade,
  relationship text not null default 'Caregiver' check (char_length(relationship) <= 80),
  created_at timestamptz not null default now(),
  unique(caregiver_user_id, elder_id)
);
create index if not exists caregiver_elder_links_caregiver_idx on public.caregiver_elder_links(caregiver_user_id);
create index if not exists caregiver_elder_links_elder_idx on public.caregiver_elder_links(elder_id);

-- SECURITY DEFINER helpers avoid recursive RLS policy evaluation.
create or replace function public.is_linked_caregiver(p_elder_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public, auth
as $$ select exists(select 1 from public.caregiver_elder_links l where l.elder_id=p_elder_id and l.caregiver_user_id=p_user_id); $$;
revoke all on function public.is_linked_caregiver(uuid, uuid) from public;
grant execute on function public.is_linked_caregiver(uuid, uuid) to authenticated;

alter table public.elders enable row level security;
alter table public.caregiver_elder_links enable row level security;
drop policy if exists "Owners and linked caregivers can read elders" on public.elders;
create policy "Owners and linked caregivers can read elders" on public.elders for select to authenticated
using (owner_user_id=(select auth.uid()) or public.is_linked_caregiver(id,(select auth.uid())));
drop policy if exists "Users can create their own elder profiles" on public.elders;
create policy "Users can create their own elder profiles" on public.elders for insert to authenticated
with check (owner_user_id=(select auth.uid()));
drop policy if exists "Owners can update elder profiles" on public.elders;
create policy "Owners can update elder profiles" on public.elders for update to authenticated
using (owner_user_id=(select auth.uid())) with check (owner_user_id=(select auth.uid()));

drop policy if exists "Users can read their own links or links to their elders" on public.caregiver_elder_links;
create policy "Users can read their own links or links to their elders" on public.caregiver_elder_links for select to authenticated
using (caregiver_user_id=(select auth.uid()) or exists(select 1 from public.elders e where e.id=elder_id and e.owner_user_id=(select auth.uid())));
drop policy if exists "Owners can link themselves as caregiver" on public.caregiver_elder_links;
create policy "Owners can link themselves as caregiver" on public.caregiver_elder_links for insert to authenticated
with check (caregiver_user_id=(select auth.uid()) and exists(select 1 from public.elders e where e.id=elder_id and e.owner_user_id=(select auth.uid())));
drop policy if exists "Caregivers can unlink themselves" on public.caregiver_elder_links;
create policy "Caregivers can unlink themselves" on public.caregiver_elder_links for delete to authenticated
using (caregiver_user_id=(select auth.uid()));

create or replace function public.link_elder_by_invite(p_invite_code text, p_relationship text default 'Caregiver')
returns uuid language plpgsql security definer set search_path = public, auth
as $$
declare v_user_id uuid := auth.uid(); v_elder_id uuid;
begin
  if v_user_id is null then raise exception 'Sign in is required'; end if;
  if p_invite_code is null or length(trim(p_invite_code)) < 6 then raise exception 'Enter a valid invitation code'; end if;
  select e.id into v_elder_id from public.elders e where e.invite_code=upper(trim(p_invite_code));
  if v_elder_id is null then raise exception 'Invitation code was not found'; end if;
  insert into public.caregiver_elder_links(caregiver_user_id,elder_id,relationship)
  values(v_user_id,v_elder_id,coalesce(nullif(trim(p_relationship),''),'Caregiver'))
  on conflict(caregiver_user_id,elder_id) do nothing;
  return v_elder_id;
end;
$$;
revoke all on function public.link_elder_by_invite(text,text) from public;
grant execute on function public.link_elder_by_invite(text,text) to authenticated;
grant select,insert,update on public.elders to authenticated;
grant select,insert,delete on public.caregiver_elder_links to authenticated;
