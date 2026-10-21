import type { Meta, StoryObj } from '@storybook/react';
import { Section, OptionGrid, ColorSwatches, Stepper } from './ui';

const meta: Meta = {
  title: 'UI/Primitives',
};

export default meta;

export const SectionStory: StoryObj = {
  render: () => (
    <Section title="Example Section">
      <p>Content goes here.</p>
    </Section>
  ),
};

const gridOptions = [
  { id: 'a', label: 'Option A' },
  { id: 'b', label: 'Option B' },
  { id: 'c', label: 'Option C' },
  { id: 'd', label: 'Option D', description: 'A longer description' },
];

export const OptionGridStory: StoryObj = {
  render: () => (
    <OptionGrid
      options={gridOptions}
      value="b"
      onSelect={() => {}}
    />
  ),
};

export const OptionGridEmpty: StoryObj = {
  render: () => (
    <div style={{ minHeight: 48 }}>
      <OptionGrid
        options={[]}
        value=""
        onSelect={() => {}}
      />
    </div>
  ),
};

export const ColorSwatchesStory: StoryObj = {
  render: () => (
    <ColorSwatches
      colors={['#1b1b1b', '#5b1f1f', '#21406b', '#3d5a80', '#c9a227', '#7a4b2a']}
      value="#c9a227"
      onSelect={() => {}}
    />
  ),
};

export const StepperStory: StoryObj = {
  render: () => (
    <Stepper
      label="Masts"
      value={2}
      min={1}
      max={3}
      onChange={() => {}}
    />
  ),
};

export const StepperAtMin: StoryObj = {
  render: () => (
    <Stepper
      label="Cannons"
      value={0}
      min={0}
      max={60}
      onChange={() => {}}
    />
  ),
};

export const StepperAtMax: StoryObj = {
  render: () => (
    <Stepper
      label="Cannons"
      value={60}
      min={0}
      max={60}
      onChange={() => {}}
    />
  ),
};
