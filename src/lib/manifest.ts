import type { BuildState, Stats } from '../types/build';
import { getShipClass } from '../data/shipClasses';
import { cannonTiers, emblems, figureheads, sailStyles, woods } from '../data/parts';

/** Produce a plain-text manifest of the current build. */
export function buildManifest(build: BuildState, stats: Stats): string {
  const shipClass = getShipClass(build.shipClassId);
  const wood = woods.find((w) => w.id === build.hull.wood)?.label ?? build.hull.wood;
  const sails = sailStyles.find((s) => s.id === build.rigging.sailStyle)?.label ?? '';
  const tier = cannonTiers.find((c) => c.id === build.armament.cannonTier)?.label ?? '';
  const emblem = emblems.find((e) => e.id === build.flag.emblem)?.label ?? '';
  const figure = figureheads.find((f) => f.id === build.figurehead.type)?.label ?? 'None';

  const lines = [
    `=== ${build.name || 'Unnamed Vessel'} ===`,
    `Class: ${shipClass.label} (${shipClass.blurb})`,
    ``,
    `Hull: ${wood}`,
    `Rigging: ${build.rigging.mastCount} mast(s), ${sails} sails`,
    `Armament: ${build.armament.cannonCount} ${tier}`,
    `Flag: ${emblem}, ${build.flag.pattern}${build.flag.text ? `, "${build.flag.text}"` : ''}`,
    `Figurehead: ${figure}`,
    ``,
    `Standing:`,
    `  Speed: ${stats.speed}`,
    `  Firepower: ${stats.firepower}`,
    `  Durability: ${stats.durability}`,
    `  Cargo: ${stats.cargo}`,
    ``,
    `Crew (${build.crew.length}):`,
    ...build.crew.map((m) => `  - ${m.name} — ${m.role} (skill ${m.skill})`),
  ];
  return lines.join('\n');
}
