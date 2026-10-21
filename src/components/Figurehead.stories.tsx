import type { Meta, StoryObj } from '@storybook/react';
import { Figurehead } from './Figurehead';
import type { FigureheadSelection } from '../types/build';

const meta: Meta = {
  title: 'Components/Figurehead',
};

export default meta;

function renderFigurehead(type: FigureheadSelection['type'], color: string) {
  return (
    <svg width={200} height={200} viewBox="-100 -100 200 200" style={{ background: '#d9c39a' }}>
      <Figurehead figurehead={{ type, color }} x={0} y={0} scale={3} />
    </svg>
  );
}

export const Siren_Gold: StoryObj = {
  render: () => renderFigurehead('siren', '#c9a227'),
};

export const Serpent_Gold: StoryObj = {
  render: () => renderFigurehead('serpent', '#c9a227'),
};

export const Raven_Grey: StoryObj = {
  render: () => renderFigurehead('raven', '#8a8a8a'),
};

export const Sphinx_Gold: StoryObj = {
  render: () => renderFigurehead('sphinx', '#c9a227'),
};

export const Dolphin_Gold: StoryObj = {
  render: () => renderFigurehead('dolphin', '#c9a227'),
};

export const Dragon_Red: StoryObj = {
  render: () => renderFigurehead('dragon', '#8a2b1b'),
};

export const Kraken_Grey: StoryObj = {
  render: () => renderFigurehead('kraken', '#8a8a8a'),
};
