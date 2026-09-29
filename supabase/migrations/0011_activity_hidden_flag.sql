-- Dad Lore App — let a creator remove their own published activity
-- from Explore, without the collateral damage a real DELETE would
-- cause. 0007_user_submitted_activities.sql deliberately left this out:
-- saved_lore/activity_completions/reports all reference activities.id
-- with `on delete cascade`, so hard-deleting a published activity would
-- silently wipe every OTHER user's saves/completions/XP tied to it too,
-- not just the creator's.
--
-- The fix: a `hidden` flag the creator can set on their own row, and
-- the app's read query excludes hidden rows. Nothing cascades — other
-- users' saved_lore/activity_completions rows are untouched (their
-- earned XP is unaffected either way, since it's stored directly on
-- each activity_completions row via xp_earned, not looked up live);
-- the only visible effect elsewhere is that a hidden activity's
-- title/icon stops resolving in someone else's history list, which is
-- strictly less destructive than a real cascade delete would have been.
-- Run this in the Supabase SQL Editor after 0010_add_extreme_activities.sql.

alter table public.activities
  add column if not exists hidden boolean not null default false;

-- Column-level write lockdown: authenticated users may update ONLY the
-- `hidden` column (never title/blurb/etc — editing published content
-- is still out of scope, same as 0007's note). Combined with the RLS
-- policy below (which row), this is the standard secure pattern for
-- "can flip this one flag on their own rows, nothing else."
revoke update on public.activities from authenticated;
grant update (hidden) on public.activities to authenticated;

drop policy if exists "Creators can hide their own activities" on public.activities;
create policy "Creators can hide their own activities"
  on public.activities
  for update
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);
