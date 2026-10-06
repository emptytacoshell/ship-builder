import { useBuild } from '../state/build';
import { statLabels } from '../lib/stats';
import { combatScore, resolveRank } from '../lib/rank';
import type { StatKey } from '../types/build';
import { Section } from './ui';

const order: StatKey[] = ['speed', 'firepower', 'durability', 'cargo'];

export function StatsPanel() {
  const { stats } = useBuild();
  const rank = resolveRank(stats);
  const score = combatScore(stats);
  return (
    <Section title="Ship's Standing">
      <div className="rank">
        <div className="rank__label">
          <span>
            <span className="rank__title">{rank.label}</span>
            <span className="rank__score">{score} combat power</span>
          </span>
        </div>
        <p className="rank__blurb">{rank.blurb}</p>
      </div>
      <div className="stats">
        {order.map((key) => (
          <div key={key} className="stat">
            <div className="stat__head">
              <span className="stat__label">
                {statLabels[key]}
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
