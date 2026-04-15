-- ─────────────────────────────────────────────────────────────────────────────
-- AAIO Platform — Initial Schema
-- Tables: profiles, subscriptions, tool_usage
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. profiles ──────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         text,                          -- 'Blogger' | 'SEO Professional' | etc.
  plan         text not null default 'free',  -- 'free' | 'pro' | 'agency'
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- ── 2. Auto-create profile trigger ───────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, plan)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', null),
    'free'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ── 3. subscriptions ─────────────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id   text,
  stripe_session_id    text,
  plan                 text not null default 'free',  -- 'pro' | 'agency'
  status               text not null default 'active',-- 'active' | 'cancelled'
  created_at           timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "subscriptions_insert_own" on public.subscriptions
  for insert with check (auth.uid() = user_id);

-- ── 4. tool_usage ─────────────────────────────────────────────────────────────
create table if not exists public.tool_usage (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  tool_slug   text not null,
  created_at  timestamptz not null default now()
);

alter table public.tool_usage enable row level security;

create policy "tool_usage_select_own" on public.tool_usage
  for select using (auth.uid() = user_id);

create policy "tool_usage_insert_own" on public.tool_usage
  for insert with check (auth.uid() = user_id);
