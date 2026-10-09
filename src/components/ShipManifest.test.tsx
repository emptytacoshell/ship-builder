import { screen } from '@testing-library/react';
import { ShipManifest } from './ShipManifest';
import { renderWithBuild, sampleBuild } from '../test/render';

describe('ShipManifest', () => {
  it('renders the manifest text and copy button', () => {
    const build = sampleBuild();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      writable: true,
    });
    renderWithBuild(<ShipManifest />, build);
    // the name appears inside a <pre> as "=== <name> ==="
    expect(screen.getByText(new RegExp(build.name))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy Manifest' })).toBeInTheDocument();
  });
});
