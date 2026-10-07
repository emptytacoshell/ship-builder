import { describe, expect, it } from 'vitest';
import { reducer } from './build';
import { getShipClass } from '../data/shipClasses';
import type { BuildState } from '../types/build';

const base = (): BuildState => {
  const brig = getShipClass('brig');
  return { ...brig.defaultBuild, shipClassId: 'brig', crew: [] };
};

describe('reducer', () => {
  it('sets the name and merges partial selection updates', () => {
    expect(reducer(base(), { type: 'setName', name: 'X' }).name).toBe('X');
    const flag = reducer(base(), { type: 'setFlag', flag: { emblem: 'anchor' } }).flag;
    expect(flag.emblem).toBe('anchor');
    expect(flag.pattern).toBe(base().flag.pattern);
  });

  it('clamps masts and cannons to class limits on rigging/armament/replaceBuild', () => {
    const brig = getShipClass('brig');
    expect(reducer(base(), { type: 'setRigging', rigging: { mastCount: 99 } }).rigging.mastCount).toBe(brig.maxMasts);
    expect(reducer(base(), { type: 'setArmament', armament: { cannonCount: 999 } }).armament.cannonCount).toBe(brig.maxCannons);
    expect(reducer(base(), { type: 'replaceBuild', build: { ...base(), rigging: { ...base().rigging, mastCount: 50 } } }).rigging.mastCount).toBe(brig.maxMasts);
  });

  it('switching class adopts its defaults but preserves name and crew', () => {
    const galleon = getShipClass('galleon');
    const next = reducer({ ...base(), name: 'My Ship', crew: [{ id: 'x', name: 'A', role: 'cook', skill: 1 }] }, { type: 'setShipClass', shipClassId: 'galleon' });
    expect(next.shipClassId).toBe('galleon');
    expect(next.rigging.mastCount).toBe(galleon.defaultMasts);
    expect(next.name).toBe('My Ship');
    expect(next.crew).toHaveLength(1);
  });

  it('addCrew / updateCrew / removeCrew manage the roster', () => {
    const added = reducer(base(), { type: 'addCrew' });
    const id = added.crew[0]!.id;
    expect(reducer(added, { type: 'updateCrew', id, patch: { skill: 5 } }).crew[0]!.skill).toBe(5);
    expect(reducer(added, { type: 'removeCrew', id }).crew).toHaveLength(0);
  });

  it('reset returns a valid default with no crew', () => {
    const next = reducer(base(), { type: 'reset' });
    expect(getShipClass(next.shipClassId)).toBeDefined();
    expect(next.crew).toHaveLength(0);
  });
});
