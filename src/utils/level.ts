const LEVEL_SIZE = 250;

export function getLevel(xp: number) {
  const level = Math.floor(xp / LEVEL_SIZE) + 1;
  const pointsIntoLevel = xp % LEVEL_SIZE;
  const progressPct = Math.round((pointsIntoLevel / LEVEL_SIZE) * 100);
  const pointsToNext = LEVEL_SIZE - pointsIntoLevel;
  return { level, pointsIntoLevel, progressPct, pointsToNext };
}

export type Rank = { name: string; minLevel: number; isTopRank: boolean };

export const RANKS: Rank[] = [
  { name: 'Couch Potato', minLevel: 1, isTopRank: false },
  { name: 'Weekend Dabbler', minLevel: 3, isTopRank: false },
  { name: 'Story Starter', minLevel: 5, isTopRank: false },
  { name: 'Lore Chaser', minLevel: 8, isTopRank: false },
  { name: 'Legend in Training', minLevel: 11, isTopRank: false },
  { name: 'Certified Menace', minLevel: 15, isTopRank: false },
  { name: 'Myth in the Making', minLevel: 20, isTopRank: false },
  { name: 'Generational Lore', minLevel: 25, isTopRank: true },
];

export function getRank(level: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (level >= rank.minLevel) current = rank;
  }
  return current;
}
