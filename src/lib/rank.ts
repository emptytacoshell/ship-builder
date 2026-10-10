import type { Stats } from '../types/build';

export interface ShipRank {
  id: string;
  label: string;
  blurb: string;
  minScore: number;
}

/** Total combat power: firepower weighs heaviest, then speed and durability. */
export function combatScore(stats: Stats): number {
  return stats.firepower * 2 + stats.speed + stats.durability;
}

export const shipRanks: ShipRank[] = [
  { id: 'longboat', label: 'Schooner of the Shore', blurb: 'A humble hull. The tide respects it… mildly.', minScore: 0 },
  { id: 'brig', label: 'Brig of the Fleet', blurb: 'A respectable craft. Other captains nod as she passes.', minScore: 180 },
  { id: 'frigate', label: 'Frigate of the Admiralty', blurb: 'Quick, hard to kill, and well-armed. A force to be counted.', minScore: 300 },
  { id: 'corsair', label: 'Corsair of the High Seas', blurb: 'A privateer\'s nightmare. Rumors of her grow with every coast.', minScore: 420 },
  { id: 'galleon', label: 'Galleon of Legend', blurb: 'A floating fortress of cannon and gold. The sea itself steps aside.', minScore: 540 },
  { id: 'leviathan', label: 'Leviathan of the Deep', blurb: 'Sailors cross themselves at her name. Few have seen her — and lived to tell it.', minScore: 660 },
];

/** Resolve the highest rank whose threshold the ship meets. */
export function resolveRank(stats: Stats): ShipRank {
  const score = combatScore(stats);
  let rank = shipRanks[0];
  for (const r of shipRanks) {
    if (score >= r.minScore) rank = r;
  }
  return rank;
}
