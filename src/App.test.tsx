import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App builder panel menu', () => {
  it('keeps the dinghy scale label readable against changing sky colors', () => {
    render(<App />);

    const dinghyLabel = screen.getByText('15 ft');
    expect(dinghyLabel).toHaveAttribute('fill', '#2b1d10');

    fireEvent.click(screen.getByRole('button', { name: 'Night' }));
    expect(dinghyLabel).toHaveAttribute('fill', '#f2e2bd');
  });

  it('adapts the header shadow to bright and dark skies', () => {
    render(<App />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('builder__header--bright-sky');

    fireEvent.click(screen.getByRole('button', { name: 'Night' }));
    expect(header).toHaveClass('builder__header--dark-sky');
  });

  it('extends storm tint over the full stage background', () => {
    render(<App />);

    const sceneBackground = document.querySelector('.builder__stage-bg');
    expect(sceneBackground).not.toHaveClass('builder__stage-bg--storm');

    fireEvent.click(screen.getByRole('button', { name: 'Storm' }));
    expect(sceneBackground).toHaveClass('builder__stage-bg--storm');
  });

  it('extends the sea fill to the scene edge and renders multiple wave lines', () => {
    render(<App />);

    const preview = document.getElementById('ship-preview-svg');
    const viewBoxHeight = Number(preview?.getAttribute('viewBox')?.split(' ')[3]);
    const sea = preview?.querySelector('rect[y="360"]');
    const waveLineCount = preview?.querySelectorAll('.wave-line').length ?? 0;
    const waveStyles = preview?.querySelector('style')?.textContent ?? '';

    expect(Number(sea?.getAttribute('y')) + Number(sea?.getAttribute('height'))).toBe(viewBoxHeight);
    expect(waveLineCount).toBeGreaterThan(2);
    expect(waveStyles).toContain('ease-in-out infinite alternate');
    expect(waveStyles).toContain('translateX(-18px)');
    expect(waveStyles).toContain('translateX(18px)');
  });

  it('opens a panel from the icon menu and closes it with Escape', () => {
    render(<App />);

    const shipPreview = document.getElementById('ship-preview-svg');
    expect(shipPreview).toBeInTheDocument();
    expect(shipPreview).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
    const classButton = screen.getByRole('button', { name: 'Ship class' });
    expect(classButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(classButton);
    expect(screen.getByRole('heading', { name: 'Ship Class' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Hull' })).not.toBeInTheDocument();
    expect(classButton).toHaveAttribute('aria-expanded', 'true');

    for (const label of ['Hull', 'Rigging', 'Armament']) {
      fireEvent.click(screen.getByRole('button', { name: label }));
      expect(screen.getByRole('heading', { name: label })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
    }

    fireEvent.click(screen.getByRole('button', { name: 'Ship name' }));
    expect(screen.getByRole('heading', { name: "Ship's Name" })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Ship Class' })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Ship builder panels' }).parentElement).not.toHaveClass(
      'builder__workspace--info',
    );

    fireEvent.click(screen.getByRole('button', { name: "Ship's standing" }));
    expect(screen.getByRole('heading', { name: "Ship's Standing" })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Ship builder panels' }).parentElement).toHaveClass(
      'builder__workspace--info',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ship manifest' }));
    expect(screen.getByRole('heading', { name: "Ship's Manifest" })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Ship builder panels' }).parentElement).toHaveClass(
      'builder__workspace--info',
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('heading', { name: "Ship's Manifest" })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ship name' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes an idle panel after ten seconds', () => {
    jest.useFakeTimers();
    try {
      render(<App />);
      fireEvent.click(screen.getByRole('button', { name: 'Hull' }));

      act(() => jest.advanceTimersByTime(10_000));

      expect(screen.queryByRole('heading', { name: 'Hull' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Hull' })).toHaveAttribute('aria-expanded', 'false');
    } finally {
      jest.useRealTimers();
    }
  });

  it('keeps a panel open for ten seconds after the latest interaction', () => {
    jest.useFakeTimers();
    try {
      render(<App />);
      fireEvent.click(screen.getByRole('button', { name: 'Hull' }));
      act(() => jest.advanceTimersByTime(9_000));

      fireEvent.pointerDown(screen.getByRole('button', { name: 'Oak' }));
      act(() => jest.advanceTimersByTime(9_000));
      expect(screen.getByRole('heading', { name: 'Hull' })).toBeInTheDocument();

      act(() => jest.advanceTimersByTime(1_000));
      expect(screen.queryByRole('heading', { name: 'Hull' })).not.toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });
});
