import type { Meta, StoryObj } from '@storybook/react';
import { ShipNaming } from './ShipNaming';

const meta: Meta = {
  title: 'Components/ShipNaming',
};

export default meta;

export const Default: StoryObj = {
  render: () => <ShipNaming />,
};
