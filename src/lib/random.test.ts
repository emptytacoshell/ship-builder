import { randomBuild } from './random';
import { getShipClass } from '../data/shipClasses';
import { crewRoles, woods, sailStyles, cannonTiers, emblems, figureheads } from '../data/parts';

describe('randomBuild', () => {
  it('produces a valid build: class, limits, parts, crew, and tier consistency', () => {
    for (let i = 0; i < 50; i++) {
      const b = randomBuild();
      const cls = getShipClass(b.shipClassId);
      // limits
      expect(b.rigging.mastCount).toBeGreaterThanOrEqual(1);
      expect(b.rigging.mastCount).toBeLessThanOrEqual(cls.maxMasts);
      expect(b.armament.cannonCount).toBeGreaterThanOrEqual(0);
      expect(b.armament.cannonCount).toBeLessThanOrEqual(cls.maxCannons);
      // no "none" tier when cannons are mounted
      if (b.armament.cannonCount > 0) expect(b.armament.cannonTier).not.toBe('none');
      // valid part ids
      expect(woods.map((w) => w.id)).toContain(b.hull.wood);
      expect(sailStyles.map((s) => s.id)).toContain(b.rigging.sailStyle);
      expect(cannonTiers.map((t) => t.id)).toContain(b.armament.cannonTier);
      expect(emblems.map((e) => e.id)).toContain(b.flag.emblem);
      expect(figureheads.map((f) => f.id)).toContain(b.figurehead.type);
      // crew validity
      for (const m of b.crew) {
        expect(crewRoles).toContain(m.role);
        expect(m.skill).toBeGreaterThanOrEqual(1);
        expect(m.skill).toBeLessThanOrEqual(5);
      }
    }
  });

  it('produces varied names', () => {
    expect(new Set(Array.from({ length: 20 }, () => randomBuild().name)).size).toBeGreaterThan(1);
  });
});
