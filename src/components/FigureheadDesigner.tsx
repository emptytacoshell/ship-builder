import { useBuild } from '../state/build';
import { figureheads, hullColors } from '../data/parts';
import { ColorSwatches, OptionGrid, Section } from './ui';
import { Figurehead } from './Figurehead';

export function FigureheadDesigner() {
  const { build, dispatch } = useBuild();

  return (
    <Section title="Figurehead">
      <div className="flag-preview">
        <svg viewBox="0 0 200 120" width="100%" height="120" aria-hidden="true">
          <Figurehead figurehead={build.figurehead} x={100} y={60} scale={2.2} />
        </svg>
      </div>
      <OptionGrid
        options={figureheads}
        value={build.figurehead.type}
        onSelect={(type) => dispatch({ type: 'setFigurehead', figurehead: { type } })}
      />
      <div className="sub-label">Color</div>
      <ColorSwatches
        colors={hullColors}
        value={build.figurehead.color}
        onSelect={(color) => dispatch({ type: 'setFigurehead', figurehead: { color } })}
      />
    </Section>
  );
}
