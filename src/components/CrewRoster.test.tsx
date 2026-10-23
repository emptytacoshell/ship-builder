import { fireEvent, screen } from '@testing-library/react';
import { sampleBuild, renderWithBuild } from '../test/render';
import { CrewRoster } from './CrewRoster';

describe('CrewRoster', () => {
  it('opens a themed role list and updates the selected crew role', () => {
    const initial = sampleBuild();
    initial.crew = [{ id: 'crew-1', name: 'Morgan', role: 'captain', skill: 3 }];
    renderWithBuild(<CrewRoster />, initial);

    fireEvent.click(screen.getByRole('combobox', { name: 'Crew role' }));
    expect(screen.getByRole('listbox', { name: 'Crew role' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('option', { name: 'Quartermaster' }));

    expect(screen.queryByRole('listbox', { name: 'Crew role' })).not.toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Crew role' })).toHaveTextContent('Quartermaster');
  });
});
