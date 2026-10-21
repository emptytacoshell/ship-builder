import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { ShipPreview } from './ShipPreview';
import { SceneProvider, type TimeOfDay, type Weather } from '../state/scene';
import { shipClasses } from '../data/shipClasses';
import type { BuildState, ShipClassId } from '../types/build';

const meta: Meta = {
  title: 'Components/ShipPreview',
};

export default meta;

function sceneDecorator(time: TimeOfDay, weather: Weather): Decorator {
  return (Story) => (
    <SceneProvider initialTimeOfDay={time} initialWeather={weather}>
      <Story />
    </SceneProvider>
  );
}

function buildFor(id: ShipClassId): BuildState {
  const cls = shipClasses.find((c) => c.id === id)!;
  return { ...cls.defaultBuild, shipClassId: id, crew: [] };
}

export const Brig_Day_Clear: StoryObj = {
  decorators: [sceneDecorator('day', 'clear')],
  render: () => <ShipPreview build={buildFor('brig')} />,
};

export const Galleon_Night_Storm: StoryObj = {
  decorators: [sceneDecorator('night', 'storm')],
  render: () => <ShipPreview build={buildFor('galleon')} />,
};

export const Frigate_Dawn_Windy: StoryObj = {
  decorators: [sceneDecorator('dawn', 'windy')],
  render: () => <ShipPreview build={buildFor('frigate')} />,
};

export const Sloop_Dusk_Clear: StoryObj = {
  decorators: [sceneDecorator('dusk', 'clear')],
  render: () => <ShipPreview build={buildFor('sloop')} />,
};

export const Longboat_Night_Clear: StoryObj = {
  decorators: [sceneDecorator('night', 'clear')],
  render: () => <ShipPreview build={buildFor('longboat')} />,
};

export const ShipOfTheLine_Day_Storm: StoryObj = {
  decorators: [sceneDecorator('day', 'storm')],
  render: () => <ShipPreview build={buildFor('ship-of-the-line')} />,
};
