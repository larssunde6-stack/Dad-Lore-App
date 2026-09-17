export type Category =
  | 'Outdoors'
  | 'Grill & Fire'
  | 'Garage & Fix-It'
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
  { label: 'Grill & Fire', icon: 'fire' },
  { label: 'Garage & Fix-It', icon: 'toolbox' },
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
    blurb: 'A rugged overlook loop with a legendary "I told you it was steep" moment.',
    location: 'Cedar Hollow Park',
    distance: '4.2 mi away',
    duration: '2.5 hrs',
    loreRating: 4,
    difficulty: 'Moderate',
    tags: ['Trailhead', 'Overlook', 'Dad Voice Required'],
  },
  {
    id: '2',
    title: 'Master the 3-Log Campfire Stack',
    category: 'Grill & Fire',
    icon: 'campfire',
    blurb: 'Prove you can build a fire without lighter fluid. Bragging rights included.',
    location: 'Miller Creek Campground',
    distance: '9.8 mi away',
    duration: '1 hr',
    loreRating: 5,
    difficulty: 'Bold',
    tags: ['Fire Starter', 'No Shortcuts', 'Story Fuel'],
  },
  {
    id: '3',
    title: 'The Great Garage Rewire',
    category: 'Garage & Fix-It',
    icon: 'wrench',
    blurb: 'Fix something nobody asked you to fix. That\'s the whole point.',
    location: 'Your Own Garage',
    distance: '0.0 mi away',
    duration: '3 hrs',
    loreRating: 3,
    difficulty: 'Moderate',
    tags: ['Toolbox', 'Mild Danger', 'Sunday Special'],
  },
  {
    id: '4',
    title: 'Horseshoe Pit Showdown',
    category: 'Backyard Games',
    icon: 'horseshoe',
    blurb: 'Undefeated since \'09. Defend the title against the next generation.',
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
    blurb: 'Paddle the twisty stretch that turns into "the time we almost tipped" forever.',
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
    blurb: 'Take the wrong exit on purpose. Find the best roadside jerky in three counties.',
    location: 'Route 9 Unknown Territory',
    distance: '22.0 mi away',
    duration: '1.5 hrs',
    loreRating: 5,
    difficulty: 'Bold',
    tags: ['Scenic Detour', 'Snack Quest', 'Map Optional'],
  },
  {
    id: '7',
    title: 'Backyard Brisket Vigil',
    category: 'Grill & Fire',
    icon: 'food-steak',
    blurb: 'Wake up at 5am to babysit a smoker for 12 hours. This is the way.',
    location: 'Home Turf',
    distance: '0.0 mi away',
    duration: '12 hrs',
    loreRating: 5,
    difficulty: 'Bold',
    tags: ['Low & Slow', 'Patience Test', 'Neighbors Will Ask'],
  },
  {
    id: '8',
    title: 'Sunrise Lake Fishing Standoff',
    category: 'Water',
    icon: 'fish',
    blurb: 'One cast, one story about "the one that got away" for the next decade.',
    location: 'Silver Hook Lake',
    distance: '6.7 mi away',
    duration: '3 hrs',
    loreRating: 4,
    difficulty: 'Easy',
    tags: ['Early Start', 'Thermos Required', 'Patience'],
  },
];
