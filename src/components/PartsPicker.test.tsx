import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PartsPicker } from './PartsPicker';
import { renderWithBuild } from '../test/render';

describe('PartsPicker', () => {
  it('renders the section headers', () => {
    renderWithBuild(<PartsPicker />);
    for (const title of ['Ship Class', 'Hull', 'Rigging', 'Armament']) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    }
  });

  it('switching ship class updates the active option', async () => {
    const user = userEvent.setup();
    renderWithBuild(<PartsPicker />);
    // scope to the Ship Class section (class names repeat across sections)
    const section = within(screen.getByRole('heading', { name: 'Ship Class' }).closest('.section')!);
    expect(section.getByText('Brig')).toHaveClass('option--active');
    await user.click(section.getByText('Galleon'));
    expect(section.getByText('Galleon')).toHaveClass('option--active');
  });
});
