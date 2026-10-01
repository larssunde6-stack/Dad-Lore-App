export const LEVEL_SIZE = 250;

export function getLevel(xp: number) {
  const level = Math.floor(xp / LEVEL_SIZE) + 1;
  const pointsIntoLevel = xp % LEVEL_SIZE;
  const progressPct = Math.round((pointsIntoLevel / LEVEL_SIZE) * 100);
  const pointsToNext = LEVEL_SIZE - pointsIntoLevel;
  return { level, pointsIntoLevel, progressPct, pointsToNext };
}

export type Rank = {
  name: string;
  minLevel: number;
  isTopRank: boolean;
  color: string;
  isRainbow?: boolean;
};

// Colors escalate from a neutral gray up through the app's warm orange
// brand tones and into red, capping at purple for the rare top rank —
// each tier reads as a step up in intensity, purple standing apart as
// the one tier RankText also gives a shimmering treatment. Certified
// Menace breaks from the orange run on purpose (a distinct teal, not a
// duplicate of the default accent) so unlocking it reads as earning
// something new rather than "the color you already had." `wtf...` is a
// secret ceiling far past the rest — its `color` is just a fallback
// swatch (e.g. for a non-animated picker row); everywhere it actually
// renders, it cycles the full rainbow instead of a fixed color.
export const RANKS: Rank[] = [
  { name: 'Couch Potato', minLevel: 1, isTopRank: false, color: '#8A8580' },
  { name: 'Weekend Dabbler', minLevel: 3, isTopRank: false, color: '#6FA8DC' },
  { name: 'Story Starter', minLevel: 5, isTopRank: false, color: '#4FB286' },
  { name: 'Lore Chaser', minLevel: 8, isTopRank: false, color: '#F2C94C' },
  { name: 'Legend in Training', minLevel: 11, isTopRank: false, color: '#FF8A3D' },
  { name: 'Certified Menace', minLevel: 15, isTopRank: false, color: '#17C3B2' },
  { name: 'Myth in the Making', minLevel: 20, isTopRank: false, color: '#E63946' },
  { name: 'Generational Lore', minLevel: 25, isTopRank: true, color: '#8F5CFF' },
  { name: 'wtf...', minLevel: 100, isTopRank: false, isRainbow: true, color: '#FF3DAE' },
];

export function getRank(level: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (level >= rank.minLevel) current = rank;
  }
  return current;
}
