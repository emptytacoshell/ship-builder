// Core domain types for the pirate ship builder.

export type ShipClassId =
  | 'brig'
  | 'galleon'
  | 'frigate'
  | 'corsair'
  | 'longboat';

export type WoodId = 'oak' | 'walnut' | 'ironwood' | 'driftwood';
export type SailStyleId = 'square' | 'lateen' | 'gaff' | 'scratched';
export type CannonTierId = 'none' | 'swivel' | 'long' | 'culverin';
export type EmblemId = 'skull' | 'anchor' | 'serpent' | 'compass' | 'crown';
export type FlagPatternId = 'solid' | 'stripes' | 'checker' | 'banner';
export type FigureheadId = 'siren' | 'serpent' | 'raven' | 'sphinx' | 'none';

export interface HullSelection {
  wood: WoodId;
  color: string;
}

export interface RiggingSelection {
  mastCount: number;
  sailStyle: SailStyleId;
  sailColor: string;
}

export interface ArmamentSelection {
  cannonCount: number;
  cannonTier: CannonTierId;
}

export interface FlagSelection {
  background: string;
  emblem: EmblemId;
  pattern: FlagPatternId;
  text: string;
}

export interface FigureheadSelection {
  type: FigureheadId;
  color: string;
}

export type CrewRole =
  | 'captain'
  | 'navigator'
  | 'gunner'
  | 'quartermaster'
  | 'surgeon'
  | 'cook';

export interface CrewMember {
  id: string;
  name: string;
  role: CrewRole;
  skill: number; // 1 - 5
}

export interface BuildState {
  name: string;
  shipClassId: ShipClassId;
  hull: HullSelection;
  rigging: RiggingSelection;
  armament: ArmamentSelection;
  flag: FlagSelection;
  figurehead: FigureheadSelection;
  crew: CrewMember[];
}

export interface Stats {
  speed: number;
  firepower: number;
  durability: number;
  cargo: number;
}

export type StatKey = keyof Stats;
