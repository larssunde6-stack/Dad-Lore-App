export type RiskLevel = 'green' | 'yellow' | 'red';
export type Kind = 'Skill' | 'Fun';
export type FunType = 'Type 1' | 'Type 2';

export type Activity = {
  id: string;
  title: string;
  icon: string;
  blurb: string;
  duration: string;
  loreRating: number; // 1-5
  riskLevel: RiskLevel;
  kind: Kind[];
  funType: FunType;
  tags: string[];
  createdBy?: string | null;
  createdByUsername?: string | null;
};

export const activities: Activity[] = [
  {
    id: 'bomb-hill-shopping-cart',
    title: 'Bomb a Hill in a Shopping Cart',
    icon: 'cart-outline',
    blurb:
      "Load one person into the cart while another gives it a push down a hill, then hop on before it picks up speed. Pick a hill with a clear runout and no traffic, and check the wheels first — a locked one will throw you off course.",
    duration: '30 min',
    loreRating: 5,
    riskLevel: 'red',
    kind: ['Fun'],
    funType: 'Type 1',
    tags: ['High Speed', 'Questionable Judgment'],
  },
  {
    id: 'soap-trash-bag-sledding',
    title: 'Go Soap Trash Bagging Down a Hill',
    icon: 'trash-can-outline',
    blurb:
      'Line a trash bag with dish soap and use it to slide down a grassy hill. Stick to short, dry grass with a clear landing area, and check for rocks or holes before you go.',
    duration: '1 hr',
    loreRating: 4,
    riskLevel: 'yellow',
    kind: ['Fun'],
    funType: 'Type 1',
    tags: ['Grass Stains', 'Zero Regrets'],
  },
  {
    id: 'ice-cube-shoe-sliding',
    title: 'Ice Cube Around Your Shoes and Go Sliding',
    icon: 'snowflake',
    blurb:
      'Freeze a block of ice, wedge it under each shoe, and slide across a smooth surface like a driveway or tile floor. Keep a hand free to catch yourself — traction changes fast as the ice melts.',
    duration: '20 min',
    loreRating: 2,
    riskLevel: 'green',
    kind: ['Fun'],
    funType: 'Type 1',
    tags: ['Backyard', 'Low Stakes'],
  },
  {
    id: 'drift-behind-car-rope',
    title: 'Drift Behind a Car with a Rope',
    icon: 'car-side',
    blurb:
      'Tie a rope to a slow-moving car and drift side to side behind it on a skateboard. Do this only in a closed, empty lot with a quick-release rope, a helmet, and clear hand signals with the driver.',
    duration: '45 min',
    loreRating: 5,
    riskLevel: 'red',
    kind: ['Skill', 'Fun'],
    funType: 'Type 1',
    tags: ['High Speed', 'Needs a Spotter'],
  },
  {
    id: 'shopping-cart-demolition-derby',
    title: 'Demolition Derby with Shopping Carts',
    icon: 'cart-arrow-right',
    blurb:
      'Round up a group of empty carts in an open lot and run them into each other, one person per cart. Clear the area of glass and curbs first, and agree on boundaries before it starts.',
    duration: '1 hr',
    loreRating: 5,
    riskLevel: 'red',
    kind: ['Fun'],
    funType: 'Type 1',
    tags: ['Full Contact', 'Bring a Helmet'],
  },
  {
    id: 'random-sport-tournament',
    title: 'Join a Random Tournament for a Random Sport Nearby',
    icon: 'trophy-outline',
    blurb:
      "Find a local pickup tournament for a sport you've never entered and sign up on the spot. Bring the right shoes and check for an entry fee or waiver first.",
    duration: 'Half day',
    loreRating: 4,
    riskLevel: 'yellow',
    kind: ['Skill', 'Fun'],
    funType: 'Type 1',
    tags: ['Wildcard', 'Competitive'],
  },
  {
    id: 'learn-backflip-ground',
    title: 'Learn to Backflip on Ground',
    icon: 'run-fast',
    blurb:
      'Practice a standing backflip on grass or a padded surface with a spotter for your first several attempts. Break the jump and rotation into steps rather than going for a full flip right away.',
    duration: 'Several sessions',
    loreRating: 4,
    riskLevel: 'yellow',
    kind: ['Skill'],
    funType: 'Type 2',
    tags: ['Practice Required', 'Spotter Recommended'],
  },
  {
    id: 'go-cliff-diving',
    title: 'Go Cliff Diving',
    icon: 'waves',
    blurb:
      "Jump from a spot that's known and regularly used for cliff diving — not a random ledge. Check water depth and for submerged rocks first, jump feet-first, and never go alone.",
    duration: '1 hr',
    loreRating: 5,
    riskLevel: 'red',
    kind: ['Fun'],
    funType: 'Type 1',
    tags: ['Adrenaline', 'Water'],
  },
  {
    id: 'climb-14k-mountain',
    title: 'Climb a 14k ft Mountain',
    icon: 'image-filter-hdr',
    blurb:
      'Pick a non-technical 14er and start before sunrise to beat afternoon storms. Bring layers, water, and food, tell someone your route, and turn back if the weather turns.',
    duration: 'Full day',
    loreRating: 5,
    riskLevel: 'red',
    kind: ['Skill'],
    funType: 'Type 2',
    tags: ['Endurance', 'Altitude'],
  },
  {
    id: 'run-a-marathon',
    title: 'Run a Marathon',
    icon: 'run',
    blurb:
      "Sign up for an official marathon and follow a training plan for at least a few months beforehand. Hydrate and fuel during the race, and don't try new shoes on race day.",
    duration: '26.2 mi',
    loreRating: 4,
    riskLevel: 'yellow',
    kind: ['Skill'],
    funType: 'Type 2',
    tags: ['Endurance', 'Training Required'],
  },
  {
    id: 'get-invited-strangers-house',
    title: "Try to Get Invited to a Stranger's House",
    icon: 'home-outline',
    blurb:
      'Strike up a real conversation with someone new and see where the day takes you. Let a friend know where you are, and trust your gut if anything feels off.',
    duration: 'Varies',
    loreRating: 3,
    riskLevel: 'green',
    kind: ['Fun'],
    funType: 'Type 1',
    tags: ['Social', 'Bold Move'],
  },
  {
    id: 'fake-pro-new-sport',
    title: "Join a Sport You've Never Played and Convince Everyone You're a Professional",
    icon: 'whistle-outline',
    blurb:
      "Show up to a pickup game for a sport you've never played and commit to the act — confident, minimal talking. Don't fake expertise in anything with real safety stakes.",
    duration: '1 hr',
    loreRating: 4,
    riskLevel: 'green',
    kind: ['Skill', 'Fun'],
    funType: 'Type 1',
    tags: ['Bluffing', 'Social'],
  },
  {
    id: 'go-on-exchange-year',
    title: 'Go on an Exchange Year',
    icon: 'airplane',
    blurb:
      'Research accredited exchange programs and apply well ahead of your target year. This is a real year-long commitment, so sort visas, school credit, and cost with your family before applying.',
    duration: '1 year',
    loreRating: 5,
    riskLevel: 'green',
    kind: ['Skill'],
    funType: 'Type 2',
    tags: ['Big Commitment', 'Life Changing'],
  },
  {
    id: 'blow-something-up',
    title: 'Blow Something Up',
    icon: 'bomb',
    blurb:
      'Use a legal method — a model rocket, a soda-and-mentos reaction, a permitted fireworks show — never anything homemade. Follow the instructions exactly and keep a safe distance.',
    duration: '1 hr',
    loreRating: 5,
    riskLevel: 'red',
    kind: ['Fun'],
    funType: 'Type 1',
    tags: ['Safety First', 'Adult Supervision'],
  },
  {
    id: 'go-spark-drifting',
    title: 'Go Spark Drifting',
    icon: 'car-sports',
    blurb:
      'Attach metal to the back of a car and drive slow circles in an empty lot at night to throw sparks. Only do this somewhere legal, away from dry grass, with a fire extinguisher on hand.',
    duration: '1 hr',
    loreRating: 4,
    riskLevel: 'red',
    kind: ['Skill', 'Fun'],
    funType: 'Type 1',
    tags: ['Sparks Fly', 'Night Activity'],
  },
  {
    id: 'learn-how-to-drift',
    title: 'Learn How to Drift',
    icon: 'steering',
    blurb:
      'Find an empty paved lot and practice controlled oversteer at low speed with an experienced driver coaching you. Keep speeds low while learning and never practice on public roads.',
    duration: 'Several sessions',
    loreRating: 4,
    riskLevel: 'yellow',
    kind: ['Skill'],
    funType: 'Type 2',
    tags: ['Practice Required', 'Empty Lot'],
  },
  {
    id: 'scooter-to-distant-land',
    title: 'Drive an Electric Scooter to a Distant Land',
    icon: 'scooter',
    blurb:
      "Pick a real destination farther than you'd normally go and ride there on an electric scooter, checking the battery range first. Wear a helmet and have a backup plan if the battery runs out.",
    duration: 'Half day',
    loreRating: 3,
    riskLevel: 'yellow',
    kind: ['Fun'],
    funType: 'Type 2',
    tags: ['Long Haul', 'Low Battery Anxiety'],
  },
  {
    id: 'fake-expert-school-presentations',
    title: "Go Around School Pretending You're an Expert on a Subject and Giving Presentations to Classes",
    icon: 'presentation',
    blurb:
      'Pick an obscure topic, put together a confident-sounding presentation, and see if you can talk your way into giving it to a class. Clear it with a teacher first.',
    duration: '1 day',
    loreRating: 4,
    riskLevel: 'green',
    kind: ['Skill', 'Fun'],
    funType: 'Type 1',
    tags: ['Bluffing', 'Public Speaking'],
  },
  {
    id: 'trampoline-twist-flips',
    title: 'Learn to Do Twist Flips on Trampoline',
    icon: 'gymnastics',
    blurb:
      'Practice on a trampoline with a net enclosure, mastering a basic flip before adding a twist. Have a spotter and never attempt a new trick without a clear landing zone.',
    duration: 'Several sessions',
    loreRating: 3,
    riskLevel: 'yellow',
    kind: ['Skill'],
    funType: 'Type 2',
    tags: ['Practice Required', 'Backyard'],
  },
  {
    id: 'go-hunting',
    title: 'Go Hunting',
    icon: 'bow-arrow',
    blurb:
      'Go out with a licensed, experienced hunter who can walk you through the basics. Get any required licenses first, wear blaze orange, and treat every weapon as if it\'s loaded.',
    duration: '1 day',
    loreRating: 3,
    riskLevel: 'yellow',
    kind: ['Skill'],
    funType: 'Type 2',
    tags: ['Patience', 'Outdoors'],
  },
  {
    id: 'kayak-wet-slope',
    title: 'Kayak Down a Wet Slope',
    icon: 'kayaking',
    blurb:
      "Find a natural water slide or steep, wet stretch of river and kayak down it with a group. Scout it first for rocks, wear a life vest, and don't run anything you can't see the bottom of.",
    duration: '2 hrs',
    loreRating: 4,
    riskLevel: 'red',
    kind: ['Skill', 'Fun'],
    funType: 'Type 1',
    tags: ['Water', 'High Speed'],
  },
  {
    id: 'learn-to-mountaineer',
    title: 'Learn to Mountaineer',
    icon: 'terrain',
    blurb:
      "Take a beginner mountaineering course covering rope work, self-arrest, and navigation before attempting a real climb. Always go with a partner, and don't skip training to rush a summit.",
    duration: 'Multi-day',
    loreRating: 4,
    riskLevel: 'yellow',
    kind: ['Skill'],
    funType: 'Type 2',
    tags: ['Training Required', 'Altitude'],
  },
];
