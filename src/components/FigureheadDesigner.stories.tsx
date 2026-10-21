import type { Meta, StoryObj } from '@storybook/react';
import { FigureheadDesigner } from './FigureheadDesigner';

const meta: Meta = {
  title: 'Components/FigureheadDesigner',
};

export default meta;

export const Default: StoryObj = {
  render: () => <FigureheadDesigner />,
};
