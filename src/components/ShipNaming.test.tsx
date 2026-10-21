import { fireEvent, screen } from '@testing-library/react';
import { ShipNaming } from './ShipNaming';
import { renderWithBuild } from '../test/render';

describe('ShipNaming', () => {
  it('renders the current name and updates it on input', () => {
    renderWithBuild(<ShipNaming />);
    const input = screen.getByPlaceholderText('Name thy vessel');
    fireEvent.change(input, { target: { value: 'Black Pearl' } });
    expect(input).toHaveValue('Black Pearl');
  });
});
