import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { SceneControls } from './SceneControls';
import { SceneProvider, type TimeOfDay, type Weather } from '../state/scene';

const meta: Meta = {
  title: 'Components/SceneControls',
};

export default meta;

function sceneDecorator(time: TimeOfDay, weather: Weather): Decorator {
  return (Story) => (
    <SceneProvider initialTimeOfDay={time} initialWeather={weather}>
      <Story />
    </SceneProvider>
  );
}

export const Day_Clear: StoryObj = {
  decorators: [sceneDecorator('day', 'clear')],
  render: () => <SceneControls />,
};

export const Night_Storm: StoryObj = {
  decorators: [sceneDecorator('night', 'storm')],
  render: () => <SceneControls />,
};

export const Dawn_Windy: StoryObj = {
  decorators: [sceneDecorator('dawn', 'windy')],
  render: () => <SceneControls />,
};
