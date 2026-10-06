import type {
  CannonTierId,
  CrewRole,
  EmblemId,
  FigureheadId,
  FlagPatternId,
  SailStyleId,
  StatKey,
  WoodId,
} from '../types/build';

/** A stat modifier applies a flat value to the named stat. */
export type StatModifier = Partial<Record<StatKey, number>>;

export interface WoodOption {
  id: WoodId;
  label: string;
  modifier: StatModifier;
}

export const woods: WoodOption[] = [
  { id: 'oak', label: 'Oak', modifier: { durability: 10, cargo: 5 } },
  { id: 'walnut', label: 'Walnut', modifier: { durability: 15, speed: -5 } },
  { id: 'ironwood', label: 'Ironwood', modifier: { durability: 25, speed: -10, cargo: -5 } },
  { id: 'driftwood', label: 'Driftwood', modifier: { durability: -10, speed: 15, cargo: -10 } },
  { id: 'teak', label: 'Teak', modifier: { durability: 12, speed: 5 } },
  { id: 'ebony', label: 'Ebony', modifier: { durability: 20, cargo: 5, speed: -8 } },
];

export interface SailStyleOption {
  id: SailStyleId;
  label: string;
  modifier: StatModifier;
}

export const sailStyles: SailStyleOption[] = [
  { id: 'square', label: 'Square', modifier: { speed: 10, cargo: 5 } },
  { id: 'lateen', label: 'Lateen', modifier: { speed: 5, firepower: 5 } },
  { id: 'gaff', label: 'Gaff', modifier: { speed: 8, durability: -5 } },
  { id: 'scratched', label: 'Scratched', modifier: { speed: -8, firepower: 12 } },
];

export interface CannonTierOption {
  id: CannonTierId;
  label: string;
  /** Firepower gained per cannon mounted. */
  perCannon: number;
  /** Durability cost per cannon (bigger guns strain the hull). */
  hullCostPerCannon: number;
}

export const cannonTiers: CannonTierOption[] = [
  { id: 'none', label: 'None', perCannon: 0, hullCostPerCannon: 0 },
  { id: 'swivel', label: 'Swivel', perCannon: 4, hullCostPerCannon: 0.5 },
  { id: 'long', label: 'Long Gun', perCannon: 7, hullCostPerCannon: 1 },
  { id: 'demi', label: 'Demi-Cannon', perCannon: 5, hullCostPerCannon: 0.75 },
  { id: 'culverin', label: 'Culverin', perCannon: 11, hullCostPerCannon: 1.5 },
  { id: 'mortar', label: 'Mortar', perCannon: 13, hullCostPerCannon: 2 },
  { id: 'blunderbuss', label: 'Blunderbuss', perCannon: 3, hullCostPerCannon: 0.25 },
  { id: 'naval', label: 'Naval Gun', perCannon: 9, hullCostPerCannon: 1.25 },
];

export interface EmblemOption {
  id: EmblemId;
  label: string;
  /** Tiny stat flavor: certain emblems inspire the crew. */
  modifier: StatModifier;
}

export const emblems: EmblemOption[] = [
  { id: 'skull', label: 'Skull & Bones', modifier: { firepower: 3 } },
  { id: 'anchor', label: 'Anchor', modifier: { durability: 3 } },
  { id: 'compass', label: 'Compass', modifier: { speed: 2, cargo: 2 } },
  { id: 'crown', label: 'Crown', modifier: { cargo: 4 } },
  { id: 'eagle', label: 'Eagle', modifier: { speed: 3, firepower: 2 } },
  { id: 'hourglass', label: 'Hourglass', modifier: { speed: 4, durability: -2 } },
];

export interface FigureheadOption {
  id: FigureheadId;
  label: string;
  modifier: StatModifier;
}

export const figureheads: FigureheadOption[] = [
  { id: 'siren', label: 'Siren', modifier: { speed: 2 } },
  { id: 'serpent', label: 'Serpent', modifier: { speed: 2 } },
  { id: 'raven', label: 'Raven', modifier: { firepower: 2 } },
  { id: 'sphinx', label: 'Sphinx', modifier: { durability: 2, cargo: 2 } },
  { id: 'dolphin', label: 'Dolphin', modifier: { speed: 3 } },
  { id: 'phoenix', label: 'Phoenix', modifier: { firepower: 3 } },
  { id: 'griffin', label: 'Griffin', modifier: { firepower: 2, durability: 2 } },
  { id: 'kraken', label: 'Kraken', modifier: { cargo: 3, durability: 1 } },
  { id: 'dragon', label: 'Dragon', modifier: { firepower: 4, speed: -2 } },
  { id: 'none', label: 'None', modifier: {} },
];

export const flagPatterns: FlagPatternId[] = ['solid', 'stripes', 'checker', 'banner'];

/** Each crew role contributes a fixed bonus to a specific stat per skill point. */
export const crewRoleStats: Record<CrewRole, StatKey> = {
  captain: 'durability',
  navigator: 'speed',
  gunner: 'firepower',
  quartermaster: 'cargo',
  surgeon: 'durability',
  cook: 'cargo',
};

export const crewRoles: CrewRole[] = [
  'captain',
  'navigator',
  'gunner',
  'quartermaster',
  'surgeon',
  'cook',
];

export const sailColors = ['#e8dcc0', '#efe6cf', '#d9c9a6', '#cbb98f', '#b04a2a', '#3d5a80', '#1b1b1b'];
export const hullColors = ['#7a4b2a', '#5b3a22', '#6b4426', '#3c2417', '#8a6a3f', '#2f3d4d', '#7a2f1b'];
export const flagColors = ['#1b1b1b', '#111111', '#5b1f1f', '#7a2f1b', '#21406b', '#3d5a80', '#c9a227', '#e8dcc0'];
