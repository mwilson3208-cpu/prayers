-- =====================================================================
-- Closer to the Father: database schema
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- It is safe to run again: it only creates things that do not exist yet.
--
-- Security model
--   * The website talks to the database only from the server, using the
--     service_role key (never sent to the browser).
--   * Row-level security is ON for every table. The public "anon" and
--     "authenticated" roles can only read approved, public rows, and only
--     the columns that are safe to show. They cannot insert, update, or
--     delete anything. Emails, IP hashes, and private requests are never
--     readable with the public key.
-- =====================================================================

create extension if not exists pgcrypto;

do $$ begin
  create type public.item_status as enum ('pending', 'approved', 'hidden');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Prayer requests
-- ---------------------------------------------------------------------
create table if not exists public.prayers (
  id            uuid primary key default gen_random_uuid(),
  name          text not null default 'Anonymous' check (char_length(name) between 1 and 40),
  request       text not null check (char_length(request) between 3 and 600),
  category      text check (category in ('Health', 'Family', 'Finances', 'Anxiety and Peace', 'Grief', 'Direction', 'Salvation', 'Other')),
  is_public     boolean not null default true,
  status        public.item_status not null default 'pending',
  flagged       boolean not null default false,
  flag_reason   text,
  prayed_count  integer not null default 0 check (prayed_count >= 0),
  ip_hash       text,
  created_at    timestamptz not null default now(),
  approved_at   timestamptz
);

create index if not exists prayers_wall_idx on public.prayers (status, is_public, created_at desc);
create index if not exists prayers_ip_idx on public.prayers (ip_hash, created_at desc);

-- Emails live in their own table so they can never leak through the wall.
create table if not exists public.prayer_contacts (
  prayer_id          uuid primary key references public.prayers (id) on delete cascade,
  email              text not null check (char_length(email) <= 254),
  notify             boolean not null default true,
  unsubscribe_token  uuid not null unique default gen_random_uuid(),
  last_notified_at   timestamptz,
  created_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Answered prayers (testimonies)
-- ---------------------------------------------------------------------
create table if not exists public.testimonies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null default 'Anonymous' check (char_length(name) between 1 and 40),
  prayed_for    text not null check (char_length(prayed_for) between 3 and 300),
  answer        text not null check (char_length(answer) between 3 and 1200),
  prayer_id     uuid references public.prayers (id) on delete set null,
  status        public.item_status not null default 'pending',
  flagged       boolean not null default false,
  flag_reason   text,
  praise_count  integer not null default 0 check (praise_count >= 0),
  ip_hash       text,
  created_at    timestamptz not null default now(),
  approved_at   timestamptz
);

create index if not exists testimonies_wall_idx on public.testimonies (status, created_at desc);
create index if not exists testimonies_ip_idx on public.testimonies (ip_hash, created_at desc);

-- ---------------------------------------------------------------------
-- "I prayed for this" and "Praise God" reactions.
-- One reaction per device, per item, per day. The unique index is the
-- server-side rate limit.
-- ---------------------------------------------------------------------
create table if not exists public.reactions (
  id          bigint generated always as identity primary key,
  kind        text not null check (kind in ('prayed', 'praise')),
  target_id   uuid not null,
  device_key  text not null,
  day         date not null default (now() at time zone 'utc')::date,
  created_at  timestamptz not null default now(),
  unique (kind, target_id, device_key, day)
);

create index if not exists reactions_target_idx on public.reactions (kind, target_id, created_at desc);

-- ---------------------------------------------------------------------
-- Contact form messages and newsletter subscribers
-- ---------------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 80),
  email       text not null check (char_length(email) <= 254),
  message     text not null check (char_length(message) between 3 and 2000),
  is_read     boolean not null default false,
  ip_hash     text,
  created_at  timestamptz not null default now()
);

create index if not exists contact_ip_idx on public.contact_messages (ip_hash, created_at desc);

create table if not exists public.subscribers (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null unique check (char_length(email) <= 254),
  source             text not null default 'footer',
  unsubscribe_token  uuid not null unique default gen_random_uuid(),
  unsubscribed_at    timestamptz,
  created_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------
alter table public.prayers          enable row level security;
alter table public.prayer_contacts  enable row level security;
alter table public.testimonies      enable row level security;
alter table public.reactions        enable row level security;
alter table public.contact_messages enable row level security;
alter table public.subscribers      enable row level security;

-- Public roles get no table access by default...
revoke all on public.prayers, public.prayer_contacts, public.testimonies,
              public.reactions, public.contact_messages, public.subscribers
  from anon, authenticated;

-- ...except read access to the safe columns of the two public walls.
grant select (id, name, request, category, prayed_count, created_at, approved_at)
  on public.prayers to anon, authenticated;
grant select (id, name, prayed_for, answer, prayer_id, praise_count, created_at, approved_at)
  on public.testimonies to anon, authenticated;

drop policy if exists "Public can read approved public prayers" on public.prayers;
create policy "Public can read approved public prayers"
  on public.prayers for select
  to anon, authenticated
  using (status = 'approved' and is_public = true);

drop policy if exists "Public can read approved testimonies" on public.testimonies;
create policy "Public can read approved testimonies"
  on public.testimonies for select
  to anon, authenticated
  using (status = 'approved');

-- No policies on prayer_contacts, reactions, contact_messages, or
-- subscribers: with RLS on and no policy, public roles see nothing.
-- The service_role key used by the server bypasses RLS.

-- ---------------------------------------------------------------------
-- Functions (callable only by the server's service_role key)
-- ---------------------------------------------------------------------

-- Records a reaction and bumps the counter in one step.
-- Returns the new count, or -1 if this device already reacted today,
-- or -2 if the item is not approved.
create or replace function public.record_reaction(p_kind text, p_target uuid, p_device text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_exists boolean;
begin
  if p_kind = 'prayed' then
    select true into v_exists from prayers where id = p_target and status = 'approved' and is_public;
  elsif p_kind = 'praise' then
    select true into v_exists from testimonies where id = p_target and status = 'approved';
  else
    raise exception 'unknown reaction kind %', p_kind;
  end if;

  if v_exists is null then
    return -2;
  end if;

  insert into reactions (kind, target_id, device_key)
  values (p_kind, p_target, p_device)
  on conflict do nothing;

  if not found then
    return -1;
  end if;

  if p_kind = 'prayed' then
    update prayers set prayed_count = prayed_count + 1 where id = p_target returning prayed_count into v_count;
  else
    update testimonies set praise_count = praise_count + 1 where id = p_target returning praise_count into v_count;
  end if;

  return v_count;
end;
$$;

-- Home page counters.
create or replace function public.site_stats()
returns table (prayers_submitted bigint, prayers_prayed bigint, answered bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from prayers where status <> 'hidden'),
    (select coalesce(sum(prayed_count), 0) from prayers),
    (select count(*) from testimonies where status = 'approved');
$$;

-- Weekly "people prayed for you" digest: one row per opted-in contact
-- whose public prayer received at least one prayer in the last 7 days.
create or replace function public.weekly_prayer_digest()
returns table (prayer_id uuid, email text, unsubscribe_token uuid, name text, request text, prayed_this_week bigint, prayed_total integer)
language sql
stable
security definer
set search_path = public
as $$
  select c.prayer_id, c.email, c.unsubscribe_token, p.name, p.request, count(r.id), p.prayed_count
  from prayer_contacts c
  join prayers p on p.id = c.prayer_id
  join reactions r on r.target_id = p.id and r.kind = 'prayed' and r.created_at > now() - interval '7 days'
  where c.notify and p.status = 'approved' and p.is_public
  group by c.prayer_id, c.email, c.unsubscribe_token, p.name, p.request, p.prayed_count;
$$;

-- Old reaction rows are only needed for the daily limit and the weekly
-- digest, so the daily job trims anything older than 30 days.
create or replace function public.prune_reactions()
returns void
language sql
security definer
set search_path = public
as $$
  delete from reactions where created_at < now() - interval '30 days';
$$;

revoke all on function public.record_reaction(text, uuid, text) from public, anon, authenticated;
revoke all on function public.site_stats() from public, anon, authenticated;
revoke all on function public.weekly_prayer_digest() from public, anon, authenticated;
revoke all on function public.prune_reactions() from public, anon, authenticated;

grant execute on function public.record_reaction(text, uuid, text) to service_role;
grant execute on function public.site_stats() to service_role;
grant execute on function public.weekly_prayer_digest() to service_role;
grant execute on function public.prune_reactions() to service_role;
