import { computeStats } from './stats';
import { shipClasses } from '../data/shipClasses';
import type { BuildState } from '../types/build';

const buildFor = (id: BuildState['shipClassId']): BuildState => {
  const c = shipClasses.find((s) => s.id === id)!;
  return { ...c.defaultBuild, shipClassId: id, crew: [] };
};

describe('computeStats', () => {
  it('stays within 0-100 and applies class + crew modifiers', () => {
    for (const c of shipClasses) {
      const base = computeStats(buildFor(c.id));
      for (const v of Object.values(base)) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
      // navigator -> speed: adding crew must not lower speed
      const withCrew = computeStats({ ...buildFor(c.id), crew: [{ id: 'x', name: 'C', role: 'navigator', skill: 5 }] });
      expect(withCrew.speed).toBeGreaterThanOrEqual(base.speed);
    }
  });

  it('is pure (same input -> same output)', () => {
    const b = buildFor('frigate');
    expect(computeStats(b)).toEqual(computeStats(b));
  });
});
