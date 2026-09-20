-- Dad Lore App — user-submitted activities ("Create Your Own").
--
-- Until now `activities` was a 100%-curated, read-only catalog: every row
-- came from a migration file or the Supabase Table Editor, and no insert
-- policy has ever existed for it. This migration lets an authenticated
-- user publish their own activity, which appears in the shared Explore
-- feed for everyone immediately (no review queue) and earns XP through
-- the existing activity_completions flow exactly like curated content —
-- a deliberate product choice, not an oversight; see PRD.md §5c/§10 for
-- the accepted UGC-safety tradeoff this creates.

alter table public.activities
  add column created_by uuid references auth.users (id) on delete set null,
  add column created_by_username text;

-- Curated rows (inserted via migration files) leave both columns null —
-- that's the "is this curated or user-submitted" signal, no separate
-- status column needed.

-- User-submitted rows never supply an id (the app always omits it), so
-- generate one server-side. Curated rows keep using their human-picked
-- slugs, since this only fires when a client insert leaves `id` out.
alter table public.activities
  alter column id set default gen_random_uuid()::text;

-- auth.uid() = created_by blocks two things at once: an insert that
-- leaves created_by unset (auth.uid() = null is never true), and an
-- insert that tries to attribute the row to someone else (auth.uid() is
-- derived server-side from the verified JWT, never client-supplied) —
-- the same pattern already used for saved_lore/activity_completions.
--
-- NOTE: this does not enforce "creator must have a real (non-anonymous)
-- account" — that's a deliberate product decision this pass made, but
-- enforcing it here would require trusting this project's JWT to carry a
-- reliable is_anonymous claim, which isn't verifiable from a sandbox with
-- no network access to the live project. It's enforced client-side only
-- in CreateActivityScreen.tsx for now — flagged explicitly in PRD.md
-- rather than silently assumed. If you want to harden this later (once
-- you can verify the claim shape against your real project), the
-- addition is:
--   and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
create policy "Authenticated users can create activities"
  on public.activities
  for insert
  to authenticated
  with check (auth.uid() = created_by);

-- Deliberately no update/delete policy for creators in this pass:
-- saved_lore/activity_completions/reports all reference activities.id
-- with `on delete cascade`, so letting a creator delete their own
-- published activity would silently cascade-delete every other user's
-- saves/completions/reports tied to it — erasing XP those users
-- legitimately earned. Removal goes through the existing Report flow for
-- now; a real self-retract feature needs its own design pass (soft
-- delete vs. hard delete, what happens to other users' completions).
