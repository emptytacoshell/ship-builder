import { useBuild } from '../state/build';
import { shipClasses } from '../data/shipClasses';
import {
  cannonTiers,
  hullColors,
  sailColors,
  sailStyles,
  woods,
} from '../data/parts';
import { ColorSwatches, OptionGrid, Section, Stepper } from './ui';

export function PartsPicker() {
  const { build, dispatch } = useBuild();
  const shipClass = shipClasses.find((c) => c.id === build.shipClassId);
  if (!shipClass) return null;

  return (
    <div className="picker">
      <Section title="Ship Class">
        <OptionGrid
          options={shipClasses}
          value={build.shipClassId}
          onSelect={(id) => dispatch({ type: 'setShipClass', shipClassId: id })}
        />
      </Section>

      <Section title="Hull">
        <OptionGrid
          options={woods}
          value={build.hull.wood}
          onSelect={(wood) => dispatch({ type: 'setHull', hull: { wood } })}
        />
        <div className="sub-label">Wood tone</div>
        <ColorSwatches
          colors={hullColors}
          value={build.hull.color}
          onSelect={(color) => dispatch({ type: 'setHull', hull: { color } })}
        />
      </Section>

      <Section title="Rigging">
        <Stepper
          label="Masts"
          value={build.rigging.mastCount}
          min={1}
          max={shipClass.maxMasts}
          onChange={(mastCount) => dispatch({ type: 'setRigging', rigging: { mastCount } })}
        />
        <OptionGrid
          options={sailStyles}
          value={build.rigging.sailStyle}
          onSelect={(sailStyle) => dispatch({ type: 'setRigging', rigging: { sailStyle } })}
        />
        <div className="sub-label">Sail color</div>
        <ColorSwatches
          colors={sailColors}
          value={build.rigging.sailColor}
          onSelect={(sailColor) => dispatch({ type: 'setRigging', rigging: { sailColor } })}
        />
      </Section>

      <Section title="Armament">
        <Stepper
          label="Cannons"
          value={build.armament.cannonCount}
          min={0}
          max={shipClass.maxCannons}
          onChange={(cannonCount) => dispatch({ type: 'setArmament', armament: { cannonCount } })}
        />
        <OptionGrid
          options={cannonTiers}
          value={build.armament.cannonTier}
          onSelect={(cannonTier) => dispatch({ type: 'setArmament', armament: { cannonTier } })}
        />
      </Section>
    </div>
  );
}
