import { describe, expect, it } from 'vitest';
import { combatScore, resolveRank, shipRanks } from './rank';

describe('rank', () => {
  it('scores firepower double, ignoring cargo', () => {
    expect(combatScore({ speed: 10, firepower: 20, durability: 30, cargo: 40 })).toBe(80);
  });

  it('resolves lowest rank for a weak ship, highest for an overpowered one', () => {
    expect(resolveRank({ speed: 1, firepower: 1, durability: 1, cargo: 1 }).id).toBe(shipRanks[0]!.id);
    expect(resolveRank({ speed: 300, firepower: 300, durability: 300, cargo: 100 }).id).toBe(shipRanks[shipRanks.length - 1]!.id);
  });

  it('is monotonic: a stronger ship ranks >= a weaker one', () => {
    const idx = (id: string) => shipRanks.findIndex((r) => r.id === id);
    const low = resolveRank({ speed: 10, firepower: 10, durability: 10, cargo: 10 });
    const high = resolveRank({ speed: 60, firepower: 60, durability: 60, cargo: 10 });
    expect(idx(high.id)).toBeGreaterThanOrEqual(idx(low.id));
  });
});
