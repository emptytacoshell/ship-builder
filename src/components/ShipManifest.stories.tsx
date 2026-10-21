import type { Meta, StoryObj } from '@storybook/react';
import { ShipManifest } from './ShipManifest';
import { shipClasses } from '../data/shipClasses';
import type { BuildState, CrewMember, ShipClassId } from '../types/build';
import { withBuild } from '../../.storybook/preview';

const meta: Meta = {
  title: 'Components/ShipManifest',
};

export default meta;

function buildFor(id: ShipClassId, crew: CrewMember[] = []): BuildState {
  const cls = shipClasses.find((c) => c.id === id)!;
  return { ...cls.defaultBuild, shipClassId: id, crew };
}

export const Brig_Default: StoryObj = {
  decorators: [withBuild(buildFor('brig'))],
  render: () => <ShipManifest />,
};

export const Galleon_WithCrew: StoryObj = {
  decorators: [
    withBuild(
      buildFor('galleon', [
        { id: '1', name: 'Anne Bonny', role: 'captain', skill: 5 },
        { id: '2', name: 'Chuck', role: 'gunner', skill: 4 },
        { id: '3', name: 'Marietta', role: 'navigator', skill: 5 },
      ]),
    ),
  ],
  render: () => <ShipManifest />,
};
