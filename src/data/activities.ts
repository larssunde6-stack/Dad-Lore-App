export type Category =
  | 'Outdoors'
  | 'Bonfire Nights'
  | 'Behind the Wheel'
  | 'Backyard Games'
  | 'Water'
  | 'Roadside Legend'
  | 'Certified Bad Ideas';

export type Coords = {
  latitude: number;
  longitude: number;
};

export type Activity = {
  id: string;
  title: string;
  category: Category;
  icon: string;
  blurb: string;
  location: string;
  distance: string;
  duration: string;
  loreRating: number; // 1-5
  difficulty: 'Easy' | 'Moderate' | 'Bold';
  tags: string[];
  coords: Coords;
};

export const categories: { label: Category; icon: string }[] = [
  { label: 'Outdoors', icon: 'pine-tree' },
  { label: 'Bonfire Nights', icon: 'fire' },
  { label: 'Behind the Wheel', icon: 'car-shift-pattern' },
  { label: 'Backyard Games', icon: 'horseshoe' },
  { label: 'Water', icon: 'water' },
  { label: 'Roadside Legend', icon: 'compass-outline' },
  { label: 'Certified Bad Ideas', icon: 'alert-decagram-outline' },
];

// Fictional home base (used as the fallback device location on Map)
export const HOME_BASE: Coords = { latitude: 45.677, longitude: -111.0429 };

export const activities: Activity[] = [
  {
    id: '1',
    title: 'Conquer the Switchback Ridge Trail',
    category: 'Outdoors',
    icon: 'hiking',
    blurb: 'A rugged overlook loop with a legendary "we definitely almost died" moment your future kids will hear about way too many times.',
    location: 'Cedar Hollow Park',
    distance: '4.2 mi away',
    duration: '2.5 hrs',
    loreRating: 4,
    difficulty: 'Moderate',
    tags: ['Trailhead', 'Overlook', 'Future Bragging Rights'],
    coords: { latitude: 45.718, longitude: -111.098 },
  },
  {
    id: '2',
    title: 'Master the 3-Log Campfire Stack',
    category: 'Bonfire Nights',
    icon: 'campfire',
    blurb: 'Build a fire without lighter fluid in front of everyone. This is the origin story of "I taught myself, actually."',
    location: 'Miller Creek Campground',
    distance: '9.8 mi away',
    duration: '1 hr',
    loreRating: 5,
    difficulty: 'Bold',
    tags: ['Fire Starter', 'No Shortcuts', 'Story Fuel'],
    coords: { latitude: 45.619, longitude: -110.902 },
  },
  {
    id: '3',
    title: 'Learn to Drive Stick in an Empty Parking Lot',
    category: 'Behind the Wheel',
    icon: 'car-shift-pattern',
    blurb: 'Stall it out fifteen times with your friend riding shotgun screaming. Someday this is "how I learned to drive" lore.',
    location: 'Old Mall Parking Lot',
    distance: '2.1 mi away',
    duration: '1.5 hrs',
    loreRating: 3,
    difficulty: 'Moderate',
    tags: ['Clutch Control', 'Mild Panic', 'Origin Story'],
    coords: { latitude: 45.689, longitude: -111.019 },
  },
  {
    id: '4',
    title: 'Horseshoe Pit Showdown',
    category: 'Backyard Games',
    icon: 'horseshoe',
    blurb: 'Undefeated since middle school. Defend the title before everyone scatters for college.',
    location: 'Grandview Backyard League',
    distance: '1.3 mi away',
    duration: '45 min',
    loreRating: 3,
    difficulty: 'Easy',
    tags: ['Rivalry', 'Trash Talk', 'Trophy On The Line'],
    coords: { latitude: 45.665, longitude: -111.033 },
  },
  {
    id: '5',
    title: 'Kayak the Bent River Bend',
    category: 'Water',
    icon: 'kayaking',
    blurb: 'Paddle the twisty stretch that turns into "the time we almost tipped" forever. Great material for a future toast.',
    location: 'Bent River Launch',
    distance: '12.4 mi away',
    duration: '2 hrs',
    loreRating: 4,
    difficulty: 'Moderate',
    tags: ['Paddle', 'Splash Zone', 'Wildlife Sighting'],
    coords: { latitude: 45.762, longitude: -110.846 },
  },
  {
    id: '6',
    title: 'The Legendary Gas Station Detour',
    category: 'Roadside Legend',
    icon: 'compass',
    blurb: 'Take the wrong exit on purpose. Find the best roadside jerky in three counties before anyone notices you\'re lost.',
    location: 'Route 9 Unknown Territory',
    distance: '22.0 mi away',
    duration: '1.5 hrs',
    loreRating: 5,
    difficulty: 'Bold',
    tags: ['Scenic Detour', 'Snack Quest', 'Map Optional'],
    coords: { latitude: 45.499, longitude: -111.287 },
  },
  {
    id: '7',
    title: 'The 2AM Diner Debrief After Prom',
    category: 'Roadside Legend',
    icon: 'silverware-fork-knife',
    blurb: 'Pancakes at 2am with everyone still in their formalwear, replaying the whole night. This is the lore your kids beg for.',
    location: 'Route 9 Diner',
    distance: '3.6 mi away',
    duration: '2 hrs',
    loreRating: 5,
    difficulty: 'Easy',
    tags: ['Late Night', 'Formalwear Optional', 'Group Chat Material'],
    coords: { latitude: 45.652, longitude: -111.005 },
  },
  {
    id: '8',
    title: 'Sunrise Lake Fishing Standoff',
    category: 'Water',
    icon: 'fish',
    blurb: 'One cast, one story about "the one that got away" that somehow gets bigger every time you retell it.',
    location: 'Silver Hook Lake',
    distance: '6.7 mi away',
    duration: '3 hrs',
    loreRating: 4,
    difficulty: 'Easy',
    tags: ['Early Start', 'Thermos Required', 'Patience'],
    coords: { latitude: 45.731, longitude: -110.954 },
  },
  {
    id: '9',
    title: 'Bomb a Hill in a Shopping Cart',
    category: 'Certified Bad Ideas',
    icon: 'cart-outline',
    blurb: 'One person steers, one person pushes, everyone regrets it by the bottom. This is a core memory whether it goes well or not.',
    location: 'Parkview Hill',
    distance: '0.8 mi away',
    duration: '30 min',
    loreRating: 5,
    difficulty: 'Bold',
    tags: ['High Speed', 'Questionable Judgment', 'Group Chat Material'],
    coords: { latitude: 45.681, longitude: -111.051 },
  },
  {
    id: '10',
    title: 'Soap Trash-Bag Sledding Down a Hill',
    category: 'Certified Bad Ideas',
    icon: 'trash-can-outline',
    blurb: 'Dish soap, a trash bag, and a grass hill. No snow required. Grass stains are the receipts.',
    location: 'Sunset Hill Field',
    distance: '1.1 mi away',
    duration: '1 hr',
    loreRating: 4,
    difficulty: 'Moderate',
    tags: ['Grass Stains', 'Zero Regrets', 'Future Cautionary Tale'],
    coords: { latitude: 45.672, longitude: -111.029 },
  },
  {
    id: '11',
    title: 'Grocery Cart Demolition Derby in the Empty Lot',
    category: 'Certified Bad Ideas',
    icon: 'cart-arrow-right',
    blurb: 'Round up every stray cart in the lot and turn it into a full-contact sport. Somebody\'s walking away with a story and a bruise.',
    location: 'Old Kmart Lot',
    distance: '2.4 mi away',
    duration: '1 hr',
    loreRating: 4,
    difficulty: 'Moderate',
    tags: ['Full Contact', 'Bring a Helmet', 'Origin Story'],
    coords: { latitude: 45.694, longitude: -111.068 },
  },
];
