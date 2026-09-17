export type Category =
  | 'Outdoors'
  | 'Bonfire Nights'
  | 'Behind the Wheel'
  | 'Backyard Games'
  | 'Water'
  | 'Roadside Legend';

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
};

export const categories: { label: Category; icon: string }[] = [
  { label: 'Outdoors', icon: 'pine-tree' },
  { label: 'Bonfire Nights', icon: 'fire' },
  { label: 'Behind the Wheel', icon: 'car-shift-pattern' },
  { label: 'Backyard Games', icon: 'horseshoe' },
  { label: 'Water', icon: 'water' },
  { label: 'Roadside Legend', icon: 'compass-outline' },
];

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
  },
];
