import { decodeBuild, encodeBuild, buildShareUrl, saveToStorage, loadFromStorage, resolveInitialBuild } from './serialize';
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

  it('saveToStorage → loadFromStorage round-trips', () => {
    saveToStorage(sample);
    expect(loadFromStorage()).toEqual(sample);
  });

  it('loadFromStorage returns null for empty or corrupt storage', () => {
    localStorage.clear();
    expect(loadFromStorage()).toBeNull();
    localStorage.setItem('pirate-ship-builder:last-build', '{not valid');
    expect(loadFromStorage()).toBeNull();
  });

  it('resolveInitialBuild prefers URL param over localStorage', () => {
    const token = encodeBuild(sample);
    const other = { ...shipClasses[1]!.defaultBuild, shipClassId: shipClasses[1]!.id, crew: [] };
    saveToStorage(other);
    const origHref = window.location.href;
    Object.defineProperty(window, 'location', {
      value: { ...window.location, search: `?build=${token}`, href: `http://localhost?build=${token}` },
      writable: true, configurable: true,
    });
    expect(resolveInitialBuild()).toEqual(sample);
    Object.defineProperty(window, 'location', { value: { ...window.location, href: origHref }, writable: true, configurable: true });
  });

  it('resolveInitialBuild falls back to localStorage when no URL param', () => {
    saveToStorage(sample);
    const origHref = window.location.href;
    Object.defineProperty(window, 'location', {
      value: { ...window.location, search: '', href: 'http://localhost' },
      writable: true, configurable: true,
    });
    expect(resolveInitialBuild()).toEqual(sample);
    Object.defineProperty(window, 'location', { value: { ...window.location, href: origHref }, writable: true, configurable: true });
  });
});
