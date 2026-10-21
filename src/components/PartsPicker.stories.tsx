import type { Meta, StoryObj } from '@storybook/react';
import { PartsPicker } from './PartsPicker';
import { shipClasses } from '../data/shipClasses';
import type { BuildState, ShipClassId } from '../types/build';
import { withBuild } from '../../.storybook/preview';

const meta: Meta = {
  title: 'Components/PartsPicker',
};

export default meta;

function buildFor(id: ShipClassId): BuildState {
  const cls = shipClasses.find((c) => c.id === id)!;
  return { ...cls.defaultBuild, shipClassId: id, crew: [] };
}

export const Brig: StoryObj = {
  decorators: [withBuild(buildFor('brig'))],
  render: () => <PartsPicker />,
};

export const Galleon: StoryObj = {
  decorators: [withBuild(buildFor('galleon'))],
  render: () => <PartsPicker />,
};

export const Sloop: StoryObj = {
  decorators: [withBuild(buildFor('sloop'))],
  render: () => <PartsPicker />,
};
