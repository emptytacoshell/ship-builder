import { useBuild } from '../state/build';
import { emblems, flagColors, flagPatterns } from '../data/parts';
import type { FlagPatternId } from '../types/build';
import { ColorSwatches, OptionGrid, Section } from './ui';
import { Flag } from './Flag';

const patternOptions: { id: FlagPatternId; label: string }[] = flagPatterns.map((p) => ({
  id: p,
  label: p[0].toUpperCase() + p.slice(1),
}));

export function FlagDesigner() {
  const { build, dispatch } = useBuild();

  return (
    <Section title="Jolly Roger">
      <div className="flag-preview">
        <svg viewBox="0 0 240 130" width="100%" height="130" aria-hidden="true">
          <Flag flag={build.flag} originX={40} originY={20} width={160} height={90} fly={1} />
        </svg>
      </div>
      <OptionGrid
        options={emblems}
        value={build.flag.emblem}
        onSelect={(emblem) => dispatch({ type: 'setFlag', flag: { emblem } })}
      />
      <OptionGrid
        options={patternOptions}
        value={build.flag.pattern}
        onSelect={(pattern) => dispatch({ type: 'setFlag', flag: { pattern } })}
      />
      <div className="sub-label">Color</div>
      <ColorSwatches
        colors={flagColors}
        value={build.flag.background}
        onSelect={(background) => dispatch({ type: 'setFlag', flag: { background } })}
      />
      <input
        className="text-input"
        placeholder="Banner text"
        value={build.flag.text}
        onChange={(e) => dispatch({ type: 'setFlag', flag: { text: e.target.value } })}
      />
    </Section>
  );
}
