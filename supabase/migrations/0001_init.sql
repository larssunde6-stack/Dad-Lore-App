-- Dad Lore App — Phase 2 initial schema
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Safe to re-run: uses "if not exists" / "on conflict" throughout.

create extension if not exists pgcrypto;

-- ============================================================
-- activities — public, curated lore-to-do listings
-- ============================================================
create table if not exists public.activities (
  id text primary key,
  title text not null,
  category text not null,
  icon text not null,
  blurb text not null,
  location text not null,
  distance text not null,
  duration text not null,
  lore_rating integer not null check (lore_rating between 1 and 5),
  difficulty text not null check (difficulty in ('Easy', 'Moderate', 'Bold')),
  tags text[] not null default '{}',
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now()
);

alter table public.activities enable row level security;

drop policy if exists "Public can read activities" on public.activities;
create policy "Public can read activities"
  on public.activities
  for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policies: activities are curated via this SQL
-- file or a future admin tool, never written by the app itself.

-- ============================================================
-- saved_lore — a user's bookmarked "to do" lore (Lore tab / To Do)
-- ============================================================
create table if not exists public.saved_lore (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_id text not null references public.activities (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, activity_id)
);

create index if not exists saved_lore_user_id_idx on public.saved_lore (user_id);

alter table public.saved_lore enable row level security;

drop policy if exists "Users can read their own saved lore" on public.saved_lore;
create policy "Users can read their own saved lore"
  on public.saved_lore
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can save lore for themselves" on public.saved_lore;
create policy "Users can save lore for themselves"
  on public.saved_lore
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can unsave their own lore" on public.saved_lore;
create policy "Users can unsave their own lore"
  on public.saved_lore
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- completed_lore — a user's PRIVATE diary of lore they've actually done.
-- No policy anywhere grants access to another user's rows — this table
-- is how "nobody else can see this" is actually enforced, not just a
-- screen the app chooses not to show.
-- ============================================================
create table if not exists public.completed_lore (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_title text not null,
  date_completed text not null,
  note text not null,
  lore_earned integer not null default 0,
  icon text not null,
  lore_summary text,
  created_at timestamptz not null default now()
);

create index if not exists completed_lore_user_id_idx on public.completed_lore (user_id);

alter table public.completed_lore enable row level security;

drop policy if exists "Users can read their own completed lore" on public.completed_lore;
create policy "Users can read their own completed lore"
  on public.completed_lore
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can log their own completed lore" on public.completed_lore;
create policy "Users can log their own completed lore"
  on public.completed_lore
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own completed lore" on public.completed_lore;
create policy "Users can delete their own completed lore"
  on public.completed_lore
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- reports — insert-only from the app. Nobody, including the reporter,
-- can read reports back through the client; only a future moderator
-- tool using the service_role key (never shipped in the app) can.
-- ============================================================
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  activity_id text not null references public.activities (id) on delete cascade,
  reason text not null,
  reporter_user_id uuid references auth.users (id) on delete set null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create index if not exists reports_activity_id_idx on public.reports (activity_id);

alter table public.reports enable row level security;

drop policy if exists "Authenticated users can file reports" on public.reports;
create policy "Authenticated users can file reports"
  on public.reports
  for insert
  to authenticated
  with check (true);

-- No select/update/delete policies on reports for anon or authenticated —
-- intentional. Review submitted reports from the Supabase Table Editor
-- (or a future admin tool using the service_role key) until then.

-- ============================================================
-- Seed data — mirrors src/data/activities.ts. Upsert so re-running this
-- file after editing an activity's copy just updates it in place.
-- ============================================================
insert into public.activities
  (id, title, category, icon, blurb, location, distance, duration, lore_rating, difficulty, tags, latitude, longitude)
values
  ('1', 'Conquer the Switchback Ridge Trail', 'Outdoors', 'hiking',
   'A rugged overlook loop with a legendary "we definitely almost died" moment your future kids will hear about way too many times.',
   'Cedar Hollow Park', '4.2 mi away', '2.5 hrs', 4, 'Moderate',
   array['Trailhead', 'Overlook', 'Future Bragging Rights'], 45.718, -111.098),

  ('2', 'Master the 3-Log Campfire Stack', 'Bonfire Nights', 'campfire',
   'Build a fire without lighter fluid in front of everyone. This is the origin story of "I taught myself, actually."',
   'Miller Creek Campground', '9.8 mi away', '1 hr', 5, 'Bold',
   array['Fire Starter', 'No Shortcuts', 'Story Fuel'], 45.619, -110.902),

  ('3', 'Learn to Drive Stick in an Empty Parking Lot', 'Behind the Wheel', 'car-shift-pattern',
   'Stall it out fifteen times with your friend riding shotgun screaming. Someday this is "how I learned to drive" lore.',
   'Old Mall Parking Lot', '2.1 mi away', '1.5 hrs', 3, 'Moderate',
   array['Clutch Control', 'Mild Panic', 'Origin Story'], 45.689, -111.019),

  ('4', 'Horseshoe Pit Showdown', 'Backyard Games', 'horseshoe',
   'Undefeated since middle school. Defend the title before everyone scatters for college.',
   'Grandview Backyard League', '1.3 mi away', '45 min', 3, 'Easy',
   array['Rivalry', 'Trash Talk', 'Trophy On The Line'], 45.665, -111.033),

  ('5', 'Kayak the Bent River Bend', 'Water', 'kayaking',
   'Paddle the twisty stretch that turns into "the time we almost tipped" forever. Great material for a future toast.',
   'Bent River Launch', '12.4 mi away', '2 hrs', 4, 'Moderate',
   array['Paddle', 'Splash Zone', 'Wildlife Sighting'], 45.762, -110.846),

  ('6', 'The Legendary Gas Station Detour', 'Roadside Legend', 'compass',
   'Take the wrong exit on purpose. Find the best roadside jerky in three counties before anyone notices you''re lost.',
   'Route 9 Unknown Territory', '22.0 mi away', '1.5 hrs', 5, 'Bold',
   array['Scenic Detour', 'Snack Quest', 'Map Optional'], 45.499, -111.287),

  ('7', 'The 2AM Diner Debrief After Prom', 'Roadside Legend', 'silverware-fork-knife',
   'Pancakes at 2am with everyone still in their formalwear, replaying the whole night. This is the lore your kids beg for.',
   'Route 9 Diner', '3.6 mi away', '2 hrs', 5, 'Easy',
   array['Late Night', 'Formalwear Optional', 'Group Chat Material'], 45.652, -111.005),

  ('8', 'Sunrise Lake Fishing Standoff', 'Water', 'fish',
   'One cast, one story about "the one that got away" that somehow gets bigger every time you retell it.',
   'Silver Hook Lake', '6.7 mi away', '3 hrs', 4, 'Easy',
   array['Early Start', 'Thermos Required', 'Patience'], 45.731, -110.954),

  ('9', 'Bomb a Hill in a Shopping Cart', 'Certified Bad Ideas', 'cart-outline',
   'One person steers, one person pushes, everyone regrets it by the bottom. This is a core memory whether it goes well or not.',
   'Parkview Hill', '0.8 mi away', '30 min', 5, 'Bold',
   array['High Speed', 'Questionable Judgment', 'Group Chat Material'], 45.681, -111.051),

  ('10', 'Soap Trash-Bag Sledding Down a Hill', 'Certified Bad Ideas', 'trash-can-outline',
   'Dish soap, a trash bag, and a grass hill. No snow required. Grass stains are the receipts.',
   'Sunset Hill Field', '1.1 mi away', '1 hr', 4, 'Moderate',
   array['Grass Stains', 'Zero Regrets', 'Future Cautionary Tale'], 45.672, -111.029),

  ('11', 'Grocery Cart Demolition Derby in the Empty Lot', 'Certified Bad Ideas', 'cart-arrow-right',
   'Round up every stray cart in the lot and turn it into a full-contact sport. Somebody''s walking away with a story and a bruise.',
   'Old Kmart Lot', '2.4 mi away', '1 hr', 4, 'Moderate',
   array['Full Contact', 'Bring a Helmet', 'Origin Story'], 45.694, -111.068)

on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  icon = excluded.icon,
  blurb = excluded.blurb,
  location = excluded.location,
  distance = excluded.distance,
  duration = excluded.duration,
  lore_rating = excluded.lore_rating,
  difficulty = excluded.difficulty,
  tags = excluded.tags,
  latitude = excluded.latitude,
  longitude = excluded.longitude;
