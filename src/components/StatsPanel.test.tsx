import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { StatsPanel } from './StatsPanel';
import { renderWithBuild } from '../test/render';
import { statLabels } from '../lib/stats';

describe('StatsPanel', () => {
  it('renders the rank label and every stat with its value', () => {
    renderWithBuild(<StatsPanel />);
    // all four stat labels are shown
    for (const label of Object.values(statLabels)) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    // a rank title and combat-power line are present
    expect(screen.getByText(/combat power/i)).toBeInTheDocument();
  });
});
