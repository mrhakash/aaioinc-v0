-- ─────────────────────────────────────────────────────────────────────────────
-- AAIO Platform — Migration 004
-- tool_results: persist tool outputs for authenticated users (Pro history tab)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.tool_results (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  tool_slug    text        not null,
  -- The input that was submitted (plain text, URL, or JSON for structured inputs)
  input_text   text,
  -- Full JSON output from the API route
  result_json  jsonb       not null,
  -- Convenience denormalized fields for fast queries / dashboard display
  score        int,        -- overall numeric score where applicable
  grade        text,       -- A/B/C/D/F grade where applicable
  created_at   timestamptz not null default now()
);

-- Fast lookup: user's recent results for a given tool
create index if not exists tool_results_user_tool_ts
  on public.tool_results (user_id, tool_slug, created_at desc);

alter table public.tool_results enable row level security;

create policy "tool_results_select_own" on public.tool_results
  for select using (auth.uid() = user_id);

create policy "tool_results_insert_own" on public.tool_results
  for insert with check (auth.uid() = user_id);

create policy "tool_results_delete_own" on public.tool_results
  for delete using (auth.uid() = user_id);
