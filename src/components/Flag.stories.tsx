import type { Meta, StoryObj } from '@storybook/react';
import { Flag } from './Flag';
import type { FlagSelection } from '../types/build';

const meta: Meta = {
  title: 'Components/Flag',
};

export default meta;

function flagProps(flag: FlagSelection) {
  return { flag, width: 120, height: 70, originX: 20, originY: 20 };
}

export const Skull_Solid_Black: StoryObj = {
  render: () => (
    <svg width={160} height={100} viewBox="0 0 160 100" style={{ background: '#d9c39a' }}>
      <Flag {...flagProps({ background: '#1b1b1b', emblem: 'skull', pattern: 'solid', text: 'BRIG' })} />
    </svg>
  ),
};

export const Crown_Banner_Red: StoryObj = {
  render: () => (
    <svg width={160} height={100} viewBox="0 0 160 100" style={{ background: '#d9c39a' }}>
      <Flag {...flagProps({ background: '#5b1f1f', emblem: 'crown', pattern: 'banner', text: 'GALLEON' })} />
    </svg>
  ),
};

export const Anchor_Stripes_Blue: StoryObj = {
  render: () => (
    <svg width={160} height={100} viewBox="0 0 160 100" style={{ background: '#d9c39a' }}>
      <Flag {...flagProps({ background: '#21406b', emblem: 'anchor', pattern: 'stripes', text: 'FRIGATE' })} />
    </svg>
  ),
};

export const Compass_Checker_Green: StoryObj = {
  render: () => (
    <svg width={160} height={100} viewBox="0 0 160 100" style={{ background: '#d9c39a' }}>
      <Flag {...flagProps({ background: '#2d5a27', emblem: 'compass', pattern: 'checker', text: 'SLOOP' })} />
    </svg>
  ),
};
