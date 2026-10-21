import type { Decorator, Preview } from '@storybook/react';
import { BuildProvider } from '../src/state/build';
import { shipClasses } from '../src/data/shipClasses';
import type { BuildState } from '../src/types/build';
import '../src/index.css';
import '../src/App.css';

/** Default brig build used as the global Storybook seed. */
const defaultBuild: BuildState = {
  ...shipClasses[0]!.defaultBuild,
  shipClassId: 'brig',
  crew: [],
};

/** Global decorator: wraps every story in a BuildProvider with the default build. */
const withDefaultBuild: Decorator = (Story) => (
  <BuildProvider initial={defaultBuild}>
    <Story />
  </BuildProvider>
);

/**
 * Override the global build for a specific story. Use as a story-level
 * decorator to seed a different ship class / build state:
 *   decorators: [withBuild(customBuild)]
 */
export function withBuild(initial: BuildState): Decorator {
  return (Story) => (
    <BuildProvider initial={initial}>
      <Story />
    </BuildProvider>
  );
}

const preview: Preview = {
  decorators: [withDefaultBuild],
};

export default preview;
