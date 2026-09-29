-- Dad Lore App — four new red-tier activities, added to push the
-- catalog's adrenaline ceiling back up after 0008 swapped out two
-- entries that read as actively dangerous (tow-surfing, spark-drifting)
-- rather than "fun and risky". These stay in the same category as the
-- rest of the red-tier catalog: real risk, but the "commercial operator
-- + standard safety gear + an actual industry around it" kind, not a
-- specific method with a track record of killing people.
-- Run this in the Supabase SQL Editor after 0009_server_side_moderation.sql.
--
-- Additive only: new rows, no deletes, no cascade effects.

insert into public.activities
  (id, title, icon, blurb, duration, lore_rating, risk_level, kind, fun_type, tags)
values
  ('tandem-skydive', 'Go Tandem Skydiving', 'parachute',
   'Jump from 10,000+ feet strapped to a certified instructor and free-fall before the parachute opens. Book a licensed dropzone, sit through the full safety briefing, and skip the big meal beforehand.',
   'Half day', 5, 'red', array['Fun'], 'Type 1', array['Adrenaline', 'Guided']),

  ('bungee-jump-platform', 'Bungee Jump Off a Real Platform', 'trending-down',
   'Book a commercial bungee operator with a certified platform and harness — never a homemade rig. Trust the cord, lean forward, and let the fall do the work.',
   '2 hrs', 5, 'red', array['Fun'], 'Type 1', array['Adrenaline', 'Guided']),

  ('whitewater-rafting-rapids', 'Run Class IV Whitewater Rapids', 'kayaking',
   'Book a guided rafting trip on a river with real rapids — Class IV is intense but run by professional outfitters every day. Wear the life vest and helmet the whole time and listen to your guide''s calls.',
   '4 hrs', 5, 'red', array['Skill', 'Fun'], 'Type 1', array['Water', 'Guided']),

  ('polar-plunge-ice-water', 'Take a Polar Plunge', 'snowflake',
   'Cut a hole in the ice or find a frozen-lake plunge event and go all the way under in freezing water. Keep it under a minute, have dry clothes and a heat source ready the second you''re out, and never do this alone.',
   '30 min', 4, 'red', array['Fun'], 'Type 1', array['Cold', 'Group Activity'])

on conflict (id) do nothing;
