import { useBuild } from '../state/build';
import { crewRoles } from '../data/parts';
import type { CrewRole } from '../types/build';
import { Section } from './ui';

const roleLabels: Record<CrewRole, string> = {
  captain: 'Captain',
  navigator: 'Navigator',
  gunner: 'Gunner',
  quartermaster: 'Quartermaster',
  surgeon: 'Surgeon',
  cook: 'Cook',
};

export function CrewRoster() {
  const { build, dispatch } = useBuild();

  return (
    <Section title="Crew Roster">
      <div className="crew">
        {build.crew.length === 0 && <p className="crew__empty">No souls aboard yet.</p>}
        {build.crew.map((member) => (
          <div key={member.id} className="crew__member">
            <input
              className="text-input crew__name"
              value={member.name}
              onChange={(e) => dispatch({ type: 'updateCrew', id: member.id, patch: { name: e.target.value } })}
            />
            <select
              className="select-input"
              value={member.role}
              onChange={(e) =>
                dispatch({ type: 'updateCrew', id: member.id, patch: { role: e.target.value as CrewRole } })
              }
            >
              {crewRoles.map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r]}
                </option>
              ))}
            </select>
            <input
              className="text-input crew__skill"
              type="number"
              min={1}
              max={5}
              title="Skill (1-5)"
              value={member.skill}
              onChange={(e) =>
                dispatch({
                  type: 'updateCrew',
                  id: member.id,
                  patch: { skill: Math.max(1, Math.min(5, Number(e.target.value) || 1)) },
                })
              }
            />
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => dispatch({ type: 'removeCrew', id: member.id })}
              aria-label="Remove crew member"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="btn" onClick={() => dispatch({ type: 'addCrew' })}>
        + Recruit crew
      </button>
    </Section>
  );
}
