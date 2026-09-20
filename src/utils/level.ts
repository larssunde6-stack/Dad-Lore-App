const LEVEL_SIZE = 250;

export function getLevel(xp: number) {
  const level = Math.floor(xp / LEVEL_SIZE) + 1;
  const pointsIntoLevel = xp % LEVEL_SIZE;
  const progressPct = Math.round((pointsIntoLevel / LEVEL_SIZE) * 100);
  const pointsToNext = LEVEL_SIZE - pointsIntoLevel;
  return { level, pointsIntoLevel, progressPct, pointsToNext };
}
