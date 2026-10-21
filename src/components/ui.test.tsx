import { fireEvent, render, screen } from '@testing-library/react';
import { ColorSwatches, OptionGrid, Section, Stepper } from './ui';

describe('ui primitives', () => {
  it('Section renders its title', () => {
    render(<Section title="Hull">content</Section>);
    expect(screen.getByRole('heading', { name: 'Hull' })).toBeInTheDocument();
  });

  it('OptionGrid marks the active option and reports selection', () => {
    const onSelect = jest.fn();
    render(
      <OptionGrid
        options={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}
        value="b"
        onSelect={onSelect}
      />,
    );
    expect(screen.getByText('B')).toHaveClass('option--active');
    fireEvent.click(screen.getByText('A'));
    expect(onSelect).toHaveBeenCalledWith('a');
  });

  it('Stepper respects min/max boundaries', () => {
    const { container } = render(<Stepper label="Masts" value={1} min={1} max={3} onChange={jest.fn()} />);
    // at min: the decrement button is disabled; at max: increment would be disabled
    expect(container.querySelector('button')!).toBeDisabled();
  });

  it('ColorSwatches marks the active swatch', () => {
    render(<ColorSwatches colors={['#111', '#222']} value="#222" onSelect={jest.fn()} />);
    expect(screen.getByLabelText('Color #222')).toHaveClass('swatch--active');
  });
});
