import { useBuild } from '../state/build';
import { figureheads, hullColors } from '../data/parts';
import { ColorSwatches, OptionGrid, Section } from './ui';

export function FigureheadDesigner() {
  const { build, dispatch } = useBuild();

  return (
    <Section title="Figurehead">
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
