import type { ReactNode } from 'react';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section">
      <h3 className="section-title">{title}</h3>
      {children}
    </section>
  );
}

export function OptionGrid<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: { id: T; label: string; description?: string }[];
  value: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="option-grid">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`option ${value === opt.id ? 'option--active' : ''}`}
          title={opt.description}
          onClick={() => onSelect(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function ColorSwatches({
  colors,
  value,
  onSelect,
}: {
  colors: string[];
  value: string;
  onSelect: (color: string) => void;
}) {
  return (
    <div className="swatches">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          className={`swatch ${value === c ? 'swatch--active' : ''}`}
          style={{ background: c }}
          aria-label={`Color ${c}`}
          onClick={() => onSelect(c)}
        />
      ))}
    </div>
  );
}

export function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="stepper">
      <span className="stepper__label">{label}</span>
      <button
        type="button"
        className="stepper__btn"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        −
      </button>
      <span className="stepper__value">{value}</span>
      <button
        type="button"
        className="stepper__btn"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        +
      </button>
    </div>
  );
}
