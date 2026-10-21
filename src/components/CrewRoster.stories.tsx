import type { Meta, StoryObj } from '@storybook/react';
import { CrewRoster } from './CrewRoster';
import type { BuildState, CrewMember } from '../types/build';
import { withBuild } from '../../.storybook/preview';

const meta: Meta = {
  title: 'Components/CrewRoster',
};

export default meta;

function buildWithCrew(crew: CrewMember[]): BuildState {
  return {
    name: 'The Reckless Tide',
    shipClassId: 'brig',
    hull: { wood: 'oak', color: '#7a4b2a' },
    rigging: { mastCount: 2, sailStyle: 'square', sailColor: '#e8dcc0' },
    armament: { cannonCount: 12, cannonTier: 'long' },
    flag: { background: '#1b1b1b', emblem: 'skull', pattern: 'solid', text: 'BRIG' },
    figurehead: { type: 'siren', color: '#c9a227' },
    crew,
  };
}

export const Empty: StoryObj = {
  decorators: [withBuild(buildWithCrew([]))],
  render: () => <CrewRoster />,
};

export const Partial: StoryObj = {
  decorators: [
    withBuild(
      buildWithCrew([
        { id: '1', name: 'Anne Bonny', role: 'captain', skill: 5 },
        { id: '2', name: 'Chuck', role: 'gunner', skill: 3 },
      ]),
    ),
  ],
  render: () => <CrewRoster />,
};

export const Full: StoryObj = {
  decorators: [
    withBuild(
      buildWithCrew([
        { id: '1', name: 'Anne Bonny', role: 'captain', skill: 5 },
        { id: '2', name: 'Chuck', role: 'gunner', skill: 3 },
        { id: '3', name: 'Marietta', role: 'navigator', skill: 4 },
        { id: '4', name: 'Pintel', role: 'quartermaster', skill: 2 },
        { id: '5', name: 'Joshamee', role: 'surgeon', skill: 4 },
        { id: '6', name: 'Bosun', role: 'cook', skill: 3 },
      ]),
    ),
  ],
  render: () => <CrewRoster />,
};
