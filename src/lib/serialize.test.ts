import { describe, expect, it } from 'vitest';
import { decodeBuild, encodeBuild, buildShareUrl } from './serialize';
import { shipClasses } from '../data/shipClasses';
import type { BuildState } from '../types/build';

const sample: BuildState = {
  ...shipClasses[0]!.defaultBuild,
  shipClassId: 'brig',
  crew: [{ id: 'c1', name: 'Peggy', role: 'captain', skill: 5 }],
};

describe('serialize', () => {
  it('round-trips a build via URL-safe tokens', () => {
    const token = encodeBuild(sample);
    expect(token).not.toMatch(/[+/=]/);
    expect(decodeBuild(token)).toEqual(sample);
  });

  it('returns null for invalid tokens', () => {
    expect(decodeBuild('not-valid!!!')).toBeNull();
    expect(decodeBuild(btoa(JSON.stringify({ name: 'nope' })))).toBeNull();
  });

  it('buildShareUrl embeds the encoded build', () => {
    const params = new URL(buildShareUrl(sample)).searchParams;
    expect(params.get('build')).toBe(encodeBuild(sample));
  });
});
