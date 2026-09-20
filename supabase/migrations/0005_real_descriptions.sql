-- Dad Lore App — replace lorem ipsum placeholder blurbs with real
-- descriptions (what to do + basic precautions), and remove tags from
-- the detail screen (tags column itself is untouched — still used for
-- search — this migration only updates blurb text).
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).
--
-- Non-destructive: updates rows in place by id, no deletes, no cascade
-- effects on saved_lore/activity_completions/reports.

update public.activities set blurb =
  'Load one person into the cart while another gives it a push down a hill, then hop on before it picks up speed. Pick a hill with a clear runout and no traffic, and check the wheels first — a locked one will throw you off course.'
  where id = 'bomb-hill-shopping-cart';

update public.activities set blurb =
  'Line a trash bag with dish soap and use it to slide down a grassy hill. Stick to short, dry grass with a clear landing area, and check for rocks or holes before you go.'
  where id = 'soap-trash-bag-sledding';

update public.activities set blurb =
  'Freeze a block of ice, wedge it under each shoe, and slide across a smooth surface like a driveway or tile floor. Keep a hand free to catch yourself — traction changes fast as the ice melts.'
  where id = 'ice-cube-shoe-sliding';

update public.activities set blurb =
  'Tie a rope to a slow-moving car and drift side to side behind it on a skateboard. Do this only in a closed, empty lot with a quick-release rope, a helmet, and clear hand signals with the driver.'
  where id = 'drift-behind-car-rope';

update public.activities set blurb =
  'Round up a group of empty carts in an open lot and run them into each other, one person per cart. Clear the area of glass and curbs first, and agree on boundaries before it starts.'
  where id = 'shopping-cart-demolition-derby';

update public.activities set blurb =
  'Find a local pickup tournament for a sport you''ve never entered and sign up on the spot. Bring the right shoes and check for an entry fee or waiver first.'
  where id = 'random-sport-tournament';

update public.activities set blurb =
  'Practice a standing backflip on grass or a padded surface with a spotter for your first several attempts. Break the jump and rotation into steps rather than going for a full flip right away.'
  where id = 'learn-backflip-ground';

update public.activities set blurb =
  'Jump from a spot that''s known and regularly used for cliff diving — not a random ledge. Check water depth and for submerged rocks first, jump feet-first, and never go alone.'
  where id = 'go-cliff-diving';

update public.activities set blurb =
  'Pick a non-technical 14er and start before sunrise to beat afternoon storms. Bring layers, water, and food, tell someone your route, and turn back if the weather turns.'
  where id = 'climb-14k-mountain';

update public.activities set blurb =
  'Sign up for an official marathon and follow a training plan for at least a few months beforehand. Hydrate and fuel during the race, and don''t try new shoes on race day.'
  where id = 'run-a-marathon';

update public.activities set blurb =
  'Strike up a real conversation with someone new and see where the day takes you. Let a friend know where you are, and trust your gut if anything feels off.'
  where id = 'get-invited-strangers-house';

update public.activities set blurb =
  'Show up to a pickup game for a sport you''ve never played and commit to the act — confident, minimal talking. Don''t fake expertise in anything with real safety stakes.'
  where id = 'fake-pro-new-sport';

update public.activities set blurb =
  'Research accredited exchange programs and apply well ahead of your target year. This is a real year-long commitment, so sort visas, school credit, and cost with your family before applying.'
  where id = 'go-on-exchange-year';

update public.activities set blurb =
  'Use a legal method — a model rocket, a soda-and-mentos reaction, a permitted fireworks show — never anything homemade. Follow the instructions exactly and keep a safe distance.'
  where id = 'blow-something-up';

update public.activities set blurb =
  'Attach metal to the back of a car and drive slow circles in an empty lot at night to throw sparks. Only do this somewhere legal, away from dry grass, with a fire extinguisher on hand.'
  where id = 'go-spark-drifting';

update public.activities set blurb =
  'Find an empty paved lot and practice controlled oversteer at low speed with an experienced driver coaching you. Keep speeds low while learning and never practice on public roads.'
  where id = 'learn-how-to-drift';

update public.activities set blurb =
  'Pick a real destination farther than you''d normally go and ride there on an electric scooter, checking the battery range first. Wear a helmet and have a backup plan if the battery runs out.'
  where id = 'scooter-to-distant-land';

update public.activities set blurb =
  'Pick an obscure topic, put together a confident-sounding presentation, and see if you can talk your way into giving it to a class. Clear it with a teacher first.'
  where id = 'fake-expert-school-presentations';

update public.activities set blurb =
  'Practice on a trampoline with a net enclosure, mastering a basic flip before adding a twist. Have a spotter and never attempt a new trick without a clear landing zone.'
  where id = 'trampoline-twist-flips';

update public.activities set blurb =
  'Go out with a licensed, experienced hunter who can walk you through the basics. Get any required licenses first, wear blaze orange, and treat every weapon as if it''s loaded.'
  where id = 'go-hunting';

update public.activities set blurb =
  'Find a natural water slide or steep, wet stretch of river and kayak down it with a group. Scout it first for rocks, wear a life vest, and don''t run anything you can''t see the bottom of.'
  where id = 'kayak-wet-slope';

update public.activities set blurb =
  'Take a beginner mountaineering course covering rope work, self-arrest, and navigation before attempting a real climb. Always go with a partner, and don''t skip training to rush a summit.'
  where id = 'learn-to-mountaineer';
