import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { BuildProvider } from '../state/build';
import type { BuildState } from '../types/build';
import { shipClasses } from '../data/shipClasses';

/** A known-valid default build to seed the provider in tests. */
export function sampleBuild(): BuildState {
  const brig = shipClasses.find((c) => c.id === 'brig')!;
  return { ...brig.defaultBuild, shipClassId: 'brig', crew: [] };
}

/** Render a component wrapped in a BuildProvider, optionally with a custom initial build. */
export function renderWithBuild(ui: ReactElement, initial?: BuildState) {
  return render(<BuildProvider initial={initial}>{ui}</BuildProvider>);
}
