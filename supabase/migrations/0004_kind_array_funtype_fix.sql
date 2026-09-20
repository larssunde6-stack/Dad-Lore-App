-- Dad Lore App — allow an activity to be both Skill and Fun, fix Type 1/2 mishaps
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).
--
-- This one is non-destructive: it alters `kind` in place (wrapping each
-- existing value in a one-element array) and updates rows by id, so any
-- saves/completions you've already logged against these activities are
-- untouched.

-- ============================================================
-- kind: text -> text[] (an activity can now be tagged both Skill and Fun)
-- ============================================================
alter table public.activities drop constraint if exists activities_kind_check;

alter table public.activities
  alter column kind type text[] using array[kind]::text[];

alter table public.activities
  add constraint activities_kind_check check (kind <@ array['Skill', 'Fun']::text[]);

-- ============================================================
-- Corrected kind + fun_type per activity (mirrors src/data/activities.ts)
-- ============================================================
update public.activities set kind = array['Fun'], fun_type = 'Type 1' where id = 'bomb-hill-shopping-cart';
update public.activities set kind = array['Fun'], fun_type = 'Type 1' where id = 'soap-trash-bag-sledding';
update public.activities set kind = array['Fun'], fun_type = 'Type 1' where id = 'ice-cube-shoe-sliding';
update public.activities set kind = array['Skill', 'Fun'], fun_type = 'Type 1' where id = 'drift-behind-car-rope';
update public.activities set kind = array['Fun'], fun_type = 'Type 1' where id = 'shopping-cart-demolition-derby';
update public.activities set kind = array['Skill', 'Fun'], fun_type = 'Type 1' where id = 'random-sport-tournament';
update public.activities set kind = array['Skill'], fun_type = 'Type 2' where id = 'learn-backflip-ground';
update public.activities set kind = array['Fun'], fun_type = 'Type 1' where id = 'go-cliff-diving';
update public.activities set kind = array['Skill'], fun_type = 'Type 2' where id = 'climb-14k-mountain';
update public.activities set kind = array['Skill'], fun_type = 'Type 2' where id = 'run-a-marathon';
update public.activities set kind = array['Fun'], fun_type = 'Type 1' where id = 'get-invited-strangers-house';
update public.activities set kind = array['Skill', 'Fun'], fun_type = 'Type 1' where id = 'fake-pro-new-sport';
update public.activities set kind = array['Skill'], fun_type = 'Type 2' where id = 'go-on-exchange-year';
update public.activities set kind = array['Fun'], fun_type = 'Type 1' where id = 'blow-something-up';
update public.activities set kind = array['Skill', 'Fun'], fun_type = 'Type 1' where id = 'go-spark-drifting';
update public.activities set kind = array['Skill'], fun_type = 'Type 2' where id = 'learn-how-to-drift';
update public.activities set kind = array['Fun'], fun_type = 'Type 2' where id = 'scooter-to-distant-land';
update public.activities set kind = array['Skill', 'Fun'], fun_type = 'Type 1' where id = 'fake-expert-school-presentations';
update public.activities set kind = array['Skill'], fun_type = 'Type 2' where id = 'trampoline-twist-flips';
update public.activities set kind = array['Skill'], fun_type = 'Type 2' where id = 'go-hunting';
update public.activities set kind = array['Skill', 'Fun'], fun_type = 'Type 1' where id = 'kayak-wet-slope';
update public.activities set kind = array['Skill'], fun_type = 'Type 2' where id = 'learn-to-mountaineer';
