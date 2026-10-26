import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { BuildProvider } from '../state/build';
import { SceneProvider } from '../state/scene';
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

/** Options for seeding the scene state in tests. */
export interface SceneRenderOptions {
  build?: BuildState;
  waterTransparent?: boolean;
}

/** Render a component wrapped in BuildProvider + SceneProvider, with optional seeding. */
export function renderWithScene(ui: ReactElement, opts: SceneRenderOptions = {}) {
  const { build, waterTransparent = true } = opts;
  return render(
    <SceneProvider initialWaterTransparent={waterTransparent}>
      <BuildProvider initial={build}>{ui}</BuildProvider>
    </SceneProvider>,
  );
}
