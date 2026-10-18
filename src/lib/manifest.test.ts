import { describe, expect, it } from 'vitest';
import { buildManifest } from './manifest';
import { computeStats } from './stats';
import { shipClasses } from '../data/shipClasses';
import type { BuildState } from '../types/build';

const sample: BuildState = {
  ...shipClasses[1]!.defaultBuild,
  shipClassId: 'galleon',
  name: 'The Golden Crown',
  crew: [
    { id: 'c1', name: 'Peggy', role: 'captain', skill: 5 },
    { id: 'c2', name: 'Barnaby', role: 'gunner', skill: 3 },
  ],
};

describe('buildManifest', () => {
  it('includes name, class, crew, and stats; falls back to "Unnamed Vessel"', () => {
    const m = buildManifest(sample, computeStats(sample));
    for (const s of ['The Golden Crown', 'Galleon', 'Peggy', 'captain', 'Barnaby', 'gunner']) expect(m).toContain(s);
    expect(m).toMatch(/Speed:\s*\d+/);
    expect(buildManifest({ ...sample, name: '' }, computeStats(sample))).toContain('Unnamed Vessel');
  });
});
