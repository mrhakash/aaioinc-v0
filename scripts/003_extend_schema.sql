-- ─────────────────────────────────────────────────────────────────────────────
-- AAIO Platform — Schema Extension
-- Migration 003: Extend profiles + add usage_tracking table
-- Compatible with Supabase Auth (email/password + OAuth + Magic Link)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Extend profiles table ──────────────────────────────────────────────────
-- Add user-facing metadata columns that are populated from auth.users
-- and can be updated by the user from the dashboard.

alter table public.profiles
  add column if not exists email           text,
  add column if not exists full_name       text,
  add column if not exists avatar_url      text,
  add column if not exists email_confirmed boolean not null default false,
  add column if not exists onboarded       boolean not null default false,
  add column if not exists stripe_customer_id text;

-- Sync email + full_name from auth metadata on profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    plan,
    email_confirmed
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      null
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture',
      null
    ),
    coalesce(new.raw_user_meta_data ->> 'role', null),
    'free',
    coalesce(new.email_confirmed_at is not null, false)
  )
  on conflict (id) do update
    set
      email           = excluded.email,
      full_name       = coalesce(excluded.full_name, profiles.full_name),
      avatar_url      = coalesce(excluded.avatar_url, profiles.avatar_url),
      email_confirmed = excluded.email_confirmed;
  return new;
end;
$$;

-- Recreate trigger (drop + create for idempotency)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ── 2. usage_tracking table ───────────────────────────────────────────────────
-- Fine-grained per-user per-tool daily rate limiting.
-- One row per (user_id, tool_slug, window_date) with an atomic count.

create table if not exists public.usage_tracking (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  tool_slug    text        not null,
  window_date  date        not null default current_date,
  count        int         not null default 1,
  last_used_at timestamptz not null default now(),
  constraint usage_tracking_unique unique (user_id, tool_slug, window_date)
);

-- Index for fast daily lookups
create index if not exists usage_tracking_user_tool_date
  on public.usage_tracking (user_id, tool_slug, window_date);

alter table public.usage_tracking enable row level security;

create policy "usage_tracking_select_own" on public.usage_tracking
  for select using (auth.uid() = user_id);

create policy "usage_tracking_insert_own" on public.usage_tracking
  for insert with check (auth.uid() = user_id);

create policy "usage_tracking_update_own" on public.usage_tracking
  for update using (auth.uid() = user_id);

-- ── 3. Upsert helper function ─────────────────────────────────────────────────
-- Called from server actions. Increments count for today, or inserts if new.
-- Returns the current count so the caller can enforce rate limits.

create or replace function public.increment_tool_usage(
  p_user_id   uuid,
  p_tool_slug text
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into public.usage_tracking (user_id, tool_slug, window_date, count, last_used_at)
  values (p_user_id, p_tool_slug, current_date, 1, now())
  on conflict (user_id, tool_slug, window_date)
  do update set
    count        = usage_tracking.count + 1,
    last_used_at = now()
  returning count into v_count;

  return v_count;
end;
$$;

-- ── 4. Plan limits reference ──────────────────────────────────────────────────
-- Static lookup table for tool daily limits per plan tier.

create table if not exists public.plan_limits (
  tool_slug   text not null,
  plan        text not null,
  daily_limit int  not null,  -- -1 = unlimited
  primary key (tool_slug, plan)
);

insert into public.plan_limits (tool_slug, plan, daily_limit) values
  ('geo-checker',     'free',   3),
  ('geo-checker',     'pro',    50),
  ('geo-checker',     'agency', -1),
  ('humanizer',       'free',   5),
  ('humanizer',       'pro',    -1),
  ('humanizer',       'agency', -1),
  ('niche-scorer',    'free',   3),
  ('niche-scorer',    'pro',    25),
  ('niche-scorer',    'agency', -1),
  ('keyword-cluster', 'free',   3),
  ('keyword-cluster', 'pro',    -1),
  ('keyword-cluster', 'agency', -1),
  ('content-brief',   'free',   3),
  ('content-brief',   'pro',    -1),
  ('content-brief',   'agency', -1),
  ('robots-checker',  'free',   5),
  ('robots-checker',  'pro',    -1),
  ('robots-checker',  'agency', -1),
  ('title-gen',       'free',   5),
  ('title-gen',       'pro',    -1),
  ('title-gen',       'agency', -1),
  ('meta-writer',     'free',   5),
  ('meta-writer',     'pro',    -1),
  ('meta-writer',     'agency', -1),
  ('stack-rec',       'free',   3),
  ('stack-rec',       'pro',    -1),
  ('stack-rec',       'agency', -1),
  -- Unlimited free tools
  ('llm-calculator',  'free',   -1),
  ('schema-gen',      'free',   -1),
  ('ai-detector',     'free',   -1),
  ('readiness-quiz',  'free',   -1),
  ('skill-finder',    'free',   -1)
on conflict (tool_slug, plan) do nothing;

alter table public.plan_limits enable row level security;

-- Plan limits are readable by all authenticated users
create policy "plan_limits_select_all" on public.plan_limits
  for select using (auth.uid() is not null);
