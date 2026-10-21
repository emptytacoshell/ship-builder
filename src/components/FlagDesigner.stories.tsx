import type { Meta, StoryObj } from '@storybook/react';
import { FlagDesigner } from './FlagDesigner';

const meta: Meta = {
  title: 'Components/FlagDesigner',
};

export default meta;

export const Default: StoryObj = {
  render: () => <FlagDesigner />,
};
