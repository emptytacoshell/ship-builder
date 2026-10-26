import { ShipPreview } from './ShipPreview';
import { renderWithScene, sampleBuild } from '../test/render';

describe('ShipPreview water layering', () => {
  it('renders a semi-transparent front water layer by default', () => {
    const { container } = renderWithScene(<ShipPreview build={sampleBuild()} />);
    const frontWater = container.querySelector('#front-water')!;
    expect(frontWater).not.toBeNull();
    expect(frontWater.getAttribute('opacity')).toBe('0.45');
  });

  it('renders an opaque front water layer when seethrough is off', () => {
    const { container } = renderWithScene(<ShipPreview build={sampleBuild()} />, {
      waterTransparent: false,
    });
    const frontWater = container.querySelector('#front-water')!;
    expect(frontWater).not.toBeNull();
    expect(frontWater.getAttribute('opacity')).toBe('1');
  });

  it('keeps the stable preview id used for PNG export', () => {
    const { container } = renderWithScene(<ShipPreview build={sampleBuild()} />);
    expect(container.querySelector('#ship-preview-svg')).not.toBeNull();
  });
});
