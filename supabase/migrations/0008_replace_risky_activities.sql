-- Dad Lore App — replace two activities that read as genuinely
-- dangerous rather than "fun and risky": being towed behind a car on a
-- skateboard (a real cause of serious injury/death, sometimes called
-- "car surfing"/tow-surfing) and attaching metal to a car to throw
-- sparks while driving (fire hazard, dubious legality). Both are the
-- kind of content App Store review flags under Guideline 1.4 (Physical
-- Safety), especially paired with this app's teen-inclusive audience.
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New
-- query) after 0007_user_submitted_activities.sql.
--
-- Non-destructive: updates rows in place by id, no deletes, no cascade
-- effects on saved_lore/activity_completions/reports — anyone who
-- already saved or completed these ids keeps that history, now showing
-- the replacement content. kind/fun_type are already correct for both
-- rows (set in 0004_kind_array_funtype_fix.sql) and are left untouched.

update public.activities set
  title = 'Learn to Wakeboard',
  icon = 'waves',
  blurb = 'Get towed behind a boat and try to stand up on your first pass — expect to eat it a few times before it clicks. Use a registered boat and driver, wear a life vest, and keep your knees bent on the pull-up.',
  duration = '1 hr',
  lore_rating = 5,
  tags = array['Water', 'High Speed']
  where id = 'drift-behind-car-rope';

update public.activities set
  title = 'Ride an ATV Trail at Night',
  icon = 'motorbike',
  blurb = 'Book a guided night ride on marked trails with headlights and a helmet — the dark completely changes how familiar terrain feels. Stick to the guide''s line and don''t pass on blind corners.',
  duration = '2 hrs',
  lore_rating = 4,
  tags = array['Night Activity', 'Guided']
  where id = 'go-spark-drifting';
