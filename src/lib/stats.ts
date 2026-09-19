import type { BuildState, StatKey, Stats } from '../types/build';
import { getShipClass } from '../data/shipClasses';
import {
  cannonTiers,
  crewRoleStats,
  emblems,
  figureheads,
  sailStyles,
  woods,
  type StatModifier,
} from '../data/parts';

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function applyModifier(stats: Stats, modifier: StatModifier): void {
  (Object.keys(modifier) as StatKey[]).forEach((key) => {
    const amount = modifier[key];
    if (typeof amount === 'number') stats[key] += amount;
  });
}

/**
 * Derive the four ship stats from the current build.
 * Pure function — safe to call on every render.
 */
export function computeStats(build: BuildState): Stats {
  const shipClass = getShipClass(build.shipClassId);
  const stats: Stats = { ...shipClass.base };

  // Part modifiers.
  const wood = woods.find((w) => w.id === build.hull.wood);
  if (wood) applyModifier(stats, wood.modifier);

  const sails = sailStyles.find((s) => s.id === build.rigging.sailStyle);
  if (sails) applyModifier(stats, sails.modifier);

  const tier = cannonTiers.find((c) => c.id === build.armament.cannonTier);
  if (tier) {
    stats.firepower += tier.perCannon * build.armament.cannonCount;
    stats.durability -= tier.hullCostPerCannon * build.armament.cannonCount;
  }

  // Rigging: more masts = more sail area = more speed, but a bigger target.
  stats.speed += (build.rigging.mastCount - 1) * 4;

  const emblem = emblems.find((e) => e.id === build.flag.emblem);
  if (emblem) applyModifier(stats, emblem.modifier);

  const figurehead = figureheads.find((f) => f.id === build.figurehead.type);
  if (figurehead) applyModifier(stats, figurehead.modifier);

  // Crew: each member adds skill points to their role's stat.
  for (const member of build.crew) {
    const statKey = crewRoleStats[member.role];
    stats[statKey] += member.skill;
  }

  // Clamp to a sane 0-100 range.
  (Object.keys(stats) as StatKey[]).forEach((key) => {
    stats[key] = clamp(stats[key]);
  });

  return stats;
}

/** Short human-readable label for each stat. */
export const statLabels: Record<StatKey, string> = {
  speed: 'Speed',
  firepower: 'Firepower',
  durability: 'Durability',
  cargo: 'Cargo',
};
