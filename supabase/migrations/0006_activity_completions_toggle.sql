-- Dad Lore App — Mark as Done becomes a true toggle (one completion per
-- activity, undoable) instead of an unbounded repeatable log.
-- Run this in the Supabase SQL Editor after 0002_activity_completions.sql.
--
-- Repeated taps on "Mark as Done" were each logging a brand new row with
-- more XP, since the original design deliberately allowed re-completing
-- an activity. In practice that meant an accidental double-tap (or the
-- lack of an "undo" button when someone changed their mind) just kept
-- piling up duplicate entries and inflating XP with no way back. This
-- migration makes completion one row per (user, activity): marking done
-- again just re-affirms the existing row, and a new DELETE policy lets
-- the app remove that row to properly "unmark" it, XP included.

-- ============================================================
-- Step 1: dedupe existing rows, keeping only the most recent
-- completion per (user_id, activity_id).
-- ============================================================
delete from public.activity_completions
where id in (
  select id from (
    select
      id,
      row_number() over (
        partition by user_id, activity_id
        order by completed_at desc, id desc
      ) as rn
    from public.activity_completions
  ) ranked
  where rn > 1
);

-- ============================================================
-- Step 2: enforce one completion per user+activity going forward.
-- ============================================================
alter table public.activity_completions
  drop constraint if exists activity_completions_user_activity_unique;

alter table public.activity_completions
  add constraint activity_completions_user_activity_unique unique (user_id, activity_id);

-- ============================================================
-- Step 3: allow users to delete their own completions (the "unmark"
-- half of the toggle).
-- ============================================================
drop policy if exists "Users can delete their own completions" on public.activity_completions;
create policy "Users can delete their own completions"
  on public.activity_completions
  for delete
  to authenticated
  using (auth.uid() = user_id);
