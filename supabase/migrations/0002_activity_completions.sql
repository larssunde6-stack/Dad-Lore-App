-- Dad Lore App — activity_completions (MVP: browse -> complete -> earn XP)
-- Run this in the Supabase SQL Editor after 0001_init.sql.
-- Safe to re-run: uses "if not exists" throughout.

-- ============================================================
-- activity_completions — a log of activities a user has marked done,
-- each earning XP. Repeatable by design (no unique constraint on
-- user_id+activity_id) — completing the same lore again logs another
-- entry and more XP, matching "collect lore" rather than a one-time
-- checkbox. Honor system: nothing here verifies the activity actually
-- happened, by deliberate choice (see PRD).
-- ============================================================
create table if not exists public.activity_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_id text not null references public.activities (id) on delete cascade,
  xp_earned integer not null default 0,
  completed_at timestamptz not null default now()
);

create index if not exists activity_completions_user_id_idx on public.activity_completions (user_id);

alter table public.activity_completions enable row level security;

drop policy if exists "Users can read their own completions" on public.activity_completions;
create policy "Users can read their own completions"
  on public.activity_completions
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can log their own completions" on public.activity_completions;
create policy "Users can log their own completions"
  on public.activity_completions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- No update/delete policy: no "undo" in this pass.
