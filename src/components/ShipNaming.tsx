import { useBuild } from '../state/build';
import { Section } from './ui';

export function ShipNaming() {
  const { build, dispatch } = useBuild();
  return (
    <Section title="Ship's Name">
      <input
        className="text-input ship-name-input"
        placeholder="Name thy vessel"
        value={build.name}
        onChange={(e) => dispatch({ type: 'setName', name: e.target.value })}
      />
    </Section>
  );
}
