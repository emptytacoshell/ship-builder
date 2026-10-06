import { useBuild } from '../state/build';
import { emblems, flagColors, flagPatterns } from '../data/parts';
import type { FlagPatternId } from '../types/build';
import { ColorSwatches, Section } from './ui';

const patternOptions: { id: FlagPatternId; label: string }[] = flagPatterns.map((p) => ({
  id: p,
  label: p[0].toUpperCase() + p.slice(1),
}));

export function FlagDesigner() {
  const { build, dispatch } = useBuild();

  return (
    <Section title="Jolly Roger">
      <div className="option-grid">
        {emblems.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`option ${build.flag.emblem === opt.id ? 'option--active' : ''}`}
            onClick={() => dispatch({ type: 'setFlag', flag: { emblem: opt.id } })}
          >
            {opt.label}
          </button>
        ))}
        {patternOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`option ${build.flag.pattern === opt.id ? 'option--active' : ''}`}
            onClick={() => dispatch({ type: 'setFlag', flag: { pattern: opt.id } })}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="sub-label">Color</div>
      <ColorSwatches
        colors={flagColors}
        value={build.flag.background}
        onSelect={(background) => dispatch({ type: 'setFlag', flag: { background } })}
      />
    </Section>
  );
}
