import type { BuildState, CrewMember, CrewRole } from '../types/build';
import { shipClasses } from '../data/shipClasses';
import {
  cannonTiers,
  crewRoles,
  emblems,
  figureheads,
  flagPatterns,
  flagColors,
  hullColors,
  sailColors,
  sailStyles,
  woods,
} from '../data/parts';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const pirateNames = [
  'The Black Gale',
  'Crimson Wake',
  'The Howling Deep',
  'Salt and Ruin',
  'The Gilded Fang',
  'Midnight Tempest',
  'The Rusted Anchor',
  'Bloodmoon Chaser',
  'The Wandering Wraith',
  'Iron Serpent',
  'The Last Lantern',
  'Tempest\'s Vengeance',
  'The Silent Fathom',
  'Golden Squall',
  'The Drowned Crown',
  'Raven\'s Bargain',
  'The Shattered Compass',
  'Vermillion Tide',
  'The Unforgiven',
  'Stormcaller',
];

/** Roll a full random build — ship class, parts, flag, figurehead, and a crew. */
export function randomBuild(): BuildState {
  const shipClass = pick(shipClasses);
  const maxMasts = shipClass.maxMasts;
  const masts = 1 + Math.floor(Math.random() * maxMasts);
  const maxCannons = shipClass.maxCannons;
  const cannons = Math.floor(Math.random() * (maxCannons + 1));

  const crewSize = Math.floor(Math.random() * 6);
  const crew: CrewMember[] = Array.from({ length: crewSize }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `Crew ${i + 1}`,
    role: pick(crewRoles) as CrewRole,
    skill: 1 + Math.floor(Math.random() * 5),
  }));

  return {
    name: pick(pirateNames),
    shipClassId: shipClass.id,
    hull: { wood: pick(woods).id, color: pick(hullColors) },
    rigging: { mastCount: masts, sailStyle: pick(sailStyles).id, sailColor: pick(sailColors) },
    armament: {
      cannonCount: cannons,
      cannonTier: cannons === 0 ? 'none' : pick(cannonTiers.filter((t) => t.id !== 'none')).id,
    },
    flag: {
      background: pick(flagColors),
      emblem: pick(emblems).id,
      pattern: pick(flagPatterns),
      text: pick(['DEATH', 'FORTUNE', 'THE DEEP', 'NO QUARTER', 'RUM', 'SPOILS']),
    },
    figurehead: { type: pick(figureheads).id, color: pick(hullColors) },
    crew,
  };
}
