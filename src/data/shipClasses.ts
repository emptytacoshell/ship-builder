import type { BuildState, ShipClassId } from '../types/build';

export interface HullGeometry {
  /** Half length of the hull in pixels. */
  halfLen: number;
  /** Hull height above the waterline. */
  freeboard: number;
  /** Hull depth below the waterline. */
  keel: number;
  /** Sterncastle (raised stern) height. */
  sternH: number;
  /** Number of gun-deck rows the hull can carry. */
  gunDecks: number;
  /** Whether the bow carries a bowsprit. */
  bowsprit: boolean;
}

export interface ShipClass {
  id: ShipClassId;
  label: string;
  blurb: string;
  /** Baseline stats before parts/crew modifiers. */
  base: {
    speed: number;
    firepower: number;
    durability: number;
    cargo: number;
  };
  /** Minimum/maximum masts and cannons this class can mount. */
  maxMasts: number;
  defaultMasts: number;
  maxCannons: number;
  /** Visual hull shape for the preview. */
  hull: HullGeometry;
  /** Default build when a new ship of this class is started. */
  defaultBuild: Omit<BuildState, 'shipClassId' | 'crew'>;
}

export const shipClasses: ShipClass[] = [
  {
    id: 'brig',
    label: 'Brig',
    blurb: 'Fast and nimble, two masts of square canvas.',
    base: { speed: 70, firepower: 35, durability: 50, cargo: 40 },
    maxMasts: 2,
    defaultMasts: 2,
    maxCannons: 20,
    hull: { halfLen: 205, freeboard: 60, keel: 34, sternH: 48, gunDecks: 1, bowsprit: true },
    defaultBuild: {
      name: "The Reckless Tide",
      hull: { wood: 'oak', color: '#7a4b2a' },
      rigging: { mastCount: 2, sailStyle: 'square', sailColor: '#e8dcc0' },
      armament: { cannonCount: 12, cannonTier: 'long' },
      flag: { background: '#1b1b1b', emblem: 'skull', pattern: 'solid', text: 'BRIG' },
      figurehead: { type: 'siren', color: '#c9a227' },
    },
  },
  {
    id: 'galleon',
    label: 'Galleon',
    blurb: 'A proud three-decker, built to carry treasure and war.',
    base: { speed: 40, firepower: 70, durability: 80, cargo: 90 },
    maxMasts: 3,
    defaultMasts: 3,
    maxCannons: 60,
    hull: { halfLen: 280, freeboard: 90, keel: 54, sternH: 78, gunDecks: 3, bowsprit: true },
    defaultBuild: {
      name: "The Golden Crown",
      hull: { wood: 'walnut', color: '#5b3a22' },
      rigging: { mastCount: 3, sailStyle: 'square', sailColor: '#efe6cf' },
      armament: { cannonCount: 40, cannonTier: 'culverin' },
      flag: { background: '#5b1f1f', emblem: 'crown', pattern: 'banner', text: 'GALLEON' },
      figurehead: { type: 'sphinx', color: '#c9a227' },
    },
  },
  {
    id: 'frigate',
    label: 'Frigate',
    blurb: 'The all-rounder of the fleet: quick, sturdy, well-armed.',
    base: { speed: 60, firepower: 55, durability: 65, cargo: 60 },
    maxMasts: 3,
    defaultMasts: 3,
    maxCannons: 40,
    hull: { halfLen: 245, freeboard: 74, keel: 44, sternH: 58, gunDecks: 2, bowsprit: true },
    defaultBuild: {
      name: "The Storm's Edge",
      hull: { wood: 'oak', color: '#6b4426' },
      rigging: { mastCount: 3, sailStyle: 'square', sailColor: '#e6d9bd' },
      armament: { cannonCount: 30, cannonTier: 'long' },
      flag: { background: '#21406b', emblem: 'anchor', pattern: 'solid', text: 'FRIGATE' },
      figurehead: { type: 'serpent', color: '#c9a227' },
    },
  },
  {
    id: 'corsair',
    label: 'Corsair',
    blurb: 'A fast privateer built to run guns and run away.',
    base: { speed: 80, firepower: 50, durability: 40, cargo: 45 },
    maxMasts: 2,
    defaultMasts: 2,
    maxCannons: 30,
    hull: { halfLen: 215, freeboard: 64, keel: 38, sternH: 52, gunDecks: 2, bowsprit: true },
    defaultBuild: {
      name: "The Black Serpent",
      hull: { wood: 'ironwood', color: '#3c2417' },
      rigging: { mastCount: 2, sailStyle: 'gaff', sailColor: '#d9c9a6' },
      armament: { cannonCount: 24, cannonTier: 'long' },
      flag: { background: '#111111', emblem: 'serpent', pattern: 'banner', text: 'CORSAIR' },
      figurehead: { type: 'raven', color: '#8a8a8a' },
    },
  },
  {
    id: 'longboat',
    label: 'Longboat',
    blurb: "Small, cheap, and quick. A crew's last resort.",
    base: { speed: 85, firepower: 15, durability: 30, cargo: 20 },
    maxMasts: 1,
    defaultMasts: 1,
    maxCannons: 4,
    hull: { halfLen: 150, freeboard: 46, keel: 24, sternH: 26, gunDecks: 1, bowsprit: false },
    defaultBuild: {
      name: "The Slippery Eel",
      hull: { wood: 'driftwood', color: '#8a6a3f' },
      rigging: { mastCount: 1, sailStyle: 'lateen', sailColor: '#e9e0c9' },
      armament: { cannonCount: 2, cannonTier: 'swivel' },
      flag: { background: '#7a2f1b', emblem: 'compass', pattern: 'stripes', text: 'BOAT' },
      figurehead: { type: 'none', color: '#c9a227' },
    },
  },
  {
    id: 'sloop',
    label: 'Sloop',
    blurb: 'A single-mast runner, light on the water and hard to catch.',
    base: { speed: 90, firepower: 25, durability: 35, cargo: 30 },
    maxMasts: 1,
    defaultMasts: 1,
    maxCannons: 10,
    hull: { halfLen: 175, freeboard: 54, keel: 30, sternH: 34, gunDecks: 1, bowsprit: true },
    defaultBuild: {
      name: "The Wind's Whisper",
      hull: { wood: 'teak', color: '#8a6a3f' },
      rigging: { mastCount: 1, sailStyle: 'gaff', sailColor: '#efe6cf' },
      armament: { cannonCount: 6, cannonTier: 'swivel' },
      flag: { background: '#3d5a80', emblem: 'eagle', pattern: 'solid', text: 'SLOOP' },
      figurehead: { type: 'dolphin', color: '#c9a227' },
    },
  },
  {
    id: 'ship-of-the-line',
    label: 'Ship of the Line',
    blurb: 'A floating fortress of three gun decks, the backbone of any fleet.',
    base: { speed: 35, firepower: 85, durability: 90, cargo: 75 },
    maxMasts: 3,
    defaultMasts: 3,
    maxCannons: 90,
    hull: { halfLen: 300, freeboard: 100, keel: 60, sternH: 88, gunDecks: 3, bowsprit: true },
    defaultBuild: {
      name: "The Iron Resolve",
      hull: { wood: 'ebony', color: '#3c2417' },
      rigging: { mastCount: 3, sailStyle: 'square', sailColor: '#d9c9a6' },
      armament: { cannonCount: 64, cannonTier: 'culverin' },
      flag: { background: '#21406b', emblem: 'anchor', pattern: 'banner', text: 'LINE' },
      figurehead: { type: 'sphinx', color: '#c9a227' },
    },
  },
  {
    id: 'schooner',
    label: 'Schooner',
    blurb: 'Two-masted and swift, a smuggler\'s darling of the trade winds.',
    base: { speed: 82, firepower: 40, durability: 45, cargo: 55 },
    maxMasts: 2,
    defaultMasts: 2,
    maxCannons: 24,
    hull: { halfLen: 220, freeboard: 66, keel: 36, sternH: 46, gunDecks: 1, bowsprit: true },
    defaultBuild: {
      name: 'The Trade Wind',
      hull: { wood: 'teak', color: '#6b4426' },
      rigging: { mastCount: 2, sailStyle: 'gaff', sailColor: '#efe6cf' },
      armament: { cannonCount: 14, cannonTier: 'demi' },
      flag: { background: '#3d5a80', emblem: 'hourglass', pattern: 'stripes', text: 'SCHOONER' },
      figurehead: { type: 'griffin', color: '#c9a227' },
    },
  },
  {
    id: 'xebec',
    label: 'Xebec',
    blurb: 'A Mediterranean raider, broad-beamed and bristling with guns.',
    base: { speed: 72, firepower: 60, durability: 50, cargo: 35 },
    maxMasts: 2,
    defaultMasts: 2,
    maxCannons: 30,
    hull: { halfLen: 200, freeboard: 58, keel: 32, sternH: 44, gunDecks: 2, bowsprit: false },
    defaultBuild: {
      name: 'The Dune Serpent',
      hull: { wood: 'ebony', color: '#3c2417' },
      rigging: { mastCount: 2, sailStyle: 'lateen', sailColor: '#d9c9a6' },
      armament: { cannonCount: 18, cannonTier: 'naval' },
      flag: { background: '#5b1f1f', emblem: 'hourglass', pattern: 'banner', text: 'XEBEC' },
      figurehead: { type: 'kraken', color: '#8a8a8a' },
    },
  },
];

export function getShipClass(id: ShipClassId): ShipClass {
  const found = shipClasses.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown ship class: ${id}`);
  return found;
}
