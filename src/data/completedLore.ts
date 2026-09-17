export type CompletedLoreEntry = {
  id: string;
  activityTitle: string;
  dateCompleted: string;
  note: string;
  loreEarned: number;
  icon: string;
  loreSummary: string;
};

export const completedLore: CompletedLoreEntry[] = [
  {
    id: 'c1',
    activityTitle: 'Learn to Drive Stick in an Empty Parking Lot',
    dateCompleted: '3 weeks ago',
    note: "Jake rode shotgun the whole time screaming every time I stalled it, which was basically every thirty seconds for the first hour. I think I killed the engine fifteen, sixteen times? Lost count. But on the last lap before we had to leave I finally got a clean launch from a dead stop and didn't stall once. We just sat there for a second not saying anything and then both started laughing.",
    loreEarned: 90,
    icon: 'car-shift-pattern',
    loreSummary: 'Stalled it fifteen times. Jake screamed fifteen times. Landed a clean launch on the sixteenth and neither of us said a word for ten full seconds.',
  },
  {
    id: 'c2',
    activityTitle: 'The 2AM Diner Debrief After Prom',
    dateCompleted: '2 months ago',
    note: 'Six of us showed up to the diner still fully dressed up, me in a tux that didn\'t fit right and everyone else in dresses that had seen better hours. We ordered every breakfast item on the menu and just replayed the entire night table by table. Got kicked out at 3:30 when the waitress needed the booth back.',
    loreEarned: 120,
    icon: 'silverware-fork-knife',
    loreSummary: 'Six of us, full formalwear, one diner booth, every item on the breakfast menu. Got politely evicted at 3:30am mid-recap.',
  },
  {
    id: 'c3',
    activityTitle: 'Master the 3-Log Campfire Stack',
    dateCompleted: '5 months ago',
    note: 'Everyone said I\'d need lighter fluid. Did it first try with just the three-log stack and some dry bark for kindling. Felt like I\'d unlocked a secret skill. My uncle didn\'t believe me until he watched me do it again.',
    loreEarned: 110,
    icon: 'campfire',
    loreSummary: 'They said I\'d need lighter fluid. Built it first try, no shortcuts. Had to do it again just to convince my uncle it wasn\'t luck.',
  },
  {
    id: 'c4',
    activityTitle: 'Bomb a Hill in a Shopping Cart',
    dateCompleted: '6 months ago',
    note: 'Marcus pushed, I steered, and about two-thirds of the way down the front wheel locked up and the whole cart went sideways. I bailed into the grass, cart kept going another twenty feet without me. Nobody got hurt, everybody got it on video.',
    loreEarned: 130,
    icon: 'cart-outline',
    loreSummary: 'Front wheel locked at full speed, cart went sideways, I bailed into the grass — the cart finished the run without me. Fully on video.',
  },
  {
    id: 'c5',
    activityTitle: 'Kayak the Bent River Bend',
    dateCompleted: '8 months ago',
    note: 'Hit the narrow part of the bend faster than I meant to and genuinely thought I was going in. Leaned hard the wrong way, somehow corrected it a half-second before flipping. Heart was pounding for the rest of the paddle.',
    loreEarned: 95,
    icon: 'kayaking',
    loreSummary: 'Hit the bend too fast, leaned the wrong way, and corrected it half a second before going in the river. Heart didn\'t settle down for the rest of the paddle.',
  },
];
