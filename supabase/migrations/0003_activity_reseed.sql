-- Dad Lore App — Explore redesign: drop location/distance, add filters
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).
--
-- HEADS UP: this deletes every existing row in `activities` and reseeds a
-- new list of 22 location-less activity ideas. Because `saved_lore`,
-- `activity_completions`, and `reports` all reference `activity_id` with
-- `on delete cascade`, any saves/completions/reports tied to the old 11
-- activities are deleted along with them. Expected for pre-launch dev
-- data, but worth knowing before you run this on a project with real
-- test data you want to keep.

-- ============================================================
-- Clear existing activities (cascades to saved_lore,
-- activity_completions, reports for the old rows).
-- ============================================================
delete from public.activities;

-- ============================================================
-- Drop the location/category/difficulty columns, add the new
-- filter dimensions (risk_level, kind, fun_type).
-- ============================================================
alter table public.activities
  drop column if exists category,
  drop column if exists location,
  drop column if exists distance,
  drop column if exists latitude,
  drop column if exists longitude,
  drop column if exists difficulty;

alter table public.activities
  add column risk_level text not null check (risk_level in ('green', 'yellow', 'red')),
  add column kind text not null check (kind in ('Skill', 'Fun')),
  add column fun_type text not null check (fun_type in ('Type 1', 'Type 2'));

-- ============================================================
-- Seed data — mirrors src/data/activities.ts. Upsert so re-running this
-- file after editing an activity's copy just updates it in place.
-- ============================================================
insert into public.activities
  (id, title, icon, blurb, duration, lore_rating, risk_level, kind, fun_type, tags)
values
  ('bomb-hill-shopping-cart', 'Bomb a Hill in a Shopping Cart', 'cart-outline',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '30 min', 5, 'red', 'Fun', 'Type 2', array['High Speed', 'Questionable Judgment']),

  ('soap-trash-bag-sledding', 'Go Soap Trash Bagging Down a Hill', 'trash-can-outline',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '1 hr', 4, 'yellow', 'Fun', 'Type 1', array['Grass Stains', 'Zero Regrets']),

  ('ice-cube-shoe-sliding', 'Ice Cube Around Your Shoes and Go Sliding', 'snowflake',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '20 min', 2, 'green', 'Fun', 'Type 1', array['Backyard', 'Low Stakes']),

  ('drift-behind-car-rope', 'Drift Behind a Car with a Rope', 'car-side',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '45 min', 5, 'red', 'Skill', 'Type 2', array['High Speed', 'Needs a Spotter']),

  ('shopping-cart-demolition-derby', 'Demolition Derby with Shopping Carts', 'cart-arrow-right',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '1 hr', 5, 'red', 'Fun', 'Type 2', array['Full Contact', 'Bring a Helmet']),

  ('random-sport-tournament', 'Join a Random Tournament for a Random Sport Nearby', 'trophy-outline',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   'Half day', 4, 'yellow', 'Skill', 'Type 1', array['Wildcard', 'Competitive']),

  ('learn-backflip-ground', 'Learn to Backflip on Ground', 'run-fast',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   'Several sessions', 4, 'yellow', 'Skill', 'Type 2', array['Practice Required', 'Spotter Recommended']),

  ('go-cliff-diving', 'Go Cliff Diving', 'waves',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '1 hr', 5, 'red', 'Fun', 'Type 1', array['Adrenaline', 'Water']),

  ('climb-14k-mountain', 'Climb a 14k ft Mountain', 'image-filter-hdr',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   'Full day', 5, 'red', 'Skill', 'Type 2', array['Endurance', 'Altitude']),

  ('run-a-marathon', 'Run a Marathon', 'run',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '26.2 mi', 4, 'yellow', 'Skill', 'Type 2', array['Endurance', 'Training Required']),

  ('get-invited-strangers-house', 'Try to Get Invited to a Stranger''s House', 'home-outline',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   'Varies', 3, 'green', 'Fun', 'Type 1', array['Social', 'Bold Move']),

  ('fake-pro-new-sport', 'Join a Sport You''ve Never Played and Convince Everyone You''re a Professional', 'whistle-outline',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '1 hr', 4, 'green', 'Fun', 'Type 1', array['Bluffing', 'Social']),

  ('go-on-exchange-year', 'Go on an Exchange Year', 'airplane',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '1 year', 5, 'green', 'Skill', 'Type 2', array['Big Commitment', 'Life Changing']),

  ('blow-something-up', 'Blow Something Up', 'bomb',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '1 hr', 5, 'red', 'Fun', 'Type 1', array['Safety First', 'Adult Supervision']),

  ('go-spark-drifting', 'Go Spark Drifting', 'car-sports',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '1 hr', 4, 'red', 'Skill', 'Type 1', array['Sparks Fly', 'Night Activity']),

  ('learn-how-to-drift', 'Learn How to Drift', 'steering',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   'Several sessions', 4, 'yellow', 'Skill', 'Type 2', array['Practice Required', 'Empty Lot']),

  ('scooter-to-distant-land', 'Drive an Electric Scooter to a Distant Land', 'scooter',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   'Half day', 3, 'yellow', 'Fun', 'Type 2', array['Long Haul', 'Low Battery Anxiety']),

  ('fake-expert-school-presentations', 'Go Around School Pretending You''re an Expert on a Subject and Giving Presentations to Classes', 'presentation',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '1 day', 4, 'green', 'Fun', 'Type 1', array['Bluffing', 'Public Speaking']),

  ('trampoline-twist-flips', 'Learn to Do Twist Flips on Trampoline', 'gymnastics',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   'Several sessions', 3, 'yellow', 'Skill', 'Type 2', array['Practice Required', 'Backyard']),

  ('go-hunting', 'Go Hunting', 'bow-arrow',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '1 day', 3, 'yellow', 'Skill', 'Type 2', array['Patience', 'Outdoors']),

  ('kayak-wet-slope', 'Kayak Down a Wet Slope', 'kayaking',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   '2 hrs', 4, 'red', 'Skill', 'Type 1', array['Water', 'High Speed']),

  ('learn-to-mountaineer', 'Learn to Mountaineer', 'terrain',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   'Multi-day', 4, 'yellow', 'Skill', 'Type 2', array['Training Required', 'Altitude'])

on conflict (id) do update set
  title = excluded.title,
  icon = excluded.icon,
  blurb = excluded.blurb,
  duration = excluded.duration,
  lore_rating = excluded.lore_rating,
  risk_level = excluded.risk_level,
  kind = excluded.kind,
  fun_type = excluded.fun_type,
  tags = excluded.tags;
