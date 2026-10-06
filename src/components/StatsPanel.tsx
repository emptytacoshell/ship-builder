import { useBuild } from '../state/build';
import { statLabels } from '../lib/stats';
import type { StatKey } from '../types/build';
import { Section } from './ui';

const order: StatKey[] = ['speed', 'firepower', 'durability', 'cargo'];

const icon: Record<StatKey, string> = {
  speed: '🌀',
  firepower: '💥',
  durability: '🛡️',
  cargo: '🧰',
};

export function StatsPanel() {
  const { stats } = useBuild();
  return (
    <Section title="Ship's Standing">
      <div className="stats">
        {order.map((key) => (
          <div key={key} className="stat">
            <div className="stat__head">
              <span className="stat__label">
                {icon[key]} {statLabels[key]}
              </span>
              <span className="stat__value">{stats[key]}</span>
            </div>
            <div className="stat__track">
              <div className="stat__fill" style={{ width: `${stats[key]}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
