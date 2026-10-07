import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShipNaming } from './ShipNaming';
import { renderWithBuild } from '../test/render';

describe('ShipNaming', () => {
  it('renders the current name and updates it on input', async () => {
    const user = userEvent.setup();
    renderWithBuild(<ShipNaming />);
    const input = screen.getByPlaceholderText('Name thy vessel');
    await user.clear(input);
    await user.type(input, 'Black Pearl');
    expect(input).toHaveValue('Black Pearl');
  });
});
