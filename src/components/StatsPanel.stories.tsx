import type { Meta, StoryObj } from '@storybook/react';
import { StatsPanel } from './StatsPanel';
import { shipClasses } from '../data/shipClasses';
import type { BuildState, ShipClassId } from '../types/build';
import { withBuild } from '../../.storybook/preview';

const meta: Meta = {
  title: 'Components/StatsPanel',
};

export default meta;

function buildFor(id: ShipClassId): BuildState {
  const cls = shipClasses.find((c) => c.id === id)!;
  return { ...cls.defaultBuild, shipClassId: id, crew: [] };
}

export const Sloop_Low: StoryObj = {
  decorators: [withBuild(buildFor('sloop'))],
  render: () => <StatsPanel />,
};

export const Brig_Mid: StoryObj = {
  decorators: [withBuild(buildFor('brig'))],
  render: () => <StatsPanel />,
};

export const Galleon_High: StoryObj = {
  decorators: [withBuild(buildFor('galleon'))],
  render: () => <StatsPanel />,
};

export const ShipOfTheLine_Max: StoryObj = {
  decorators: [withBuild(buildFor('ship-of-the-line'))],
  render: () => <StatsPanel />,
};
