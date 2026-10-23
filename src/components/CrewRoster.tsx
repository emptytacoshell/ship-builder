import { useEffect, useId, useRef, useState } from 'react';
import { useBuild } from '../state/build';
import { crewRoles } from '../data/parts';
import type { CrewRole } from '../types/build';
import { Section } from './ui';
import { Icon } from './Icon';

const roleLabels: Record<CrewRole, string> = {
  captain: 'Captain',
  navigator: 'Navigator',
  gunner: 'Gunner',
  quartermaster: 'Quartermaster',
  surgeon: 'Surgeon',
  cook: 'Cook',
};

function CrewRoleDropdown({
  value,
  onChange,
}: {
  value: CrewRole;
  onChange: (role: CrewRole) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(crewRoles.indexOf(value));
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = crewRoles.indexOf(value);

  useEffect(() => {
    if (!open) return;

    const dismissOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismissOutside);
    optionRefs.current[activeIndex]?.focus();

    return () => document.removeEventListener('pointerdown', dismissOutside);
  }, [open, activeIndex]);

  const focusOption = (index: number) => {
    const nextIndex = Math.max(0, Math.min(crewRoles.length - 1, index));
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="crew-role-select" ref={containerRef}>
      <button
        type="button"
        className="crew-role-select__trigger"
        role="combobox"
        aria-label="Crew role"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          setActiveIndex(selectedIndex);
          setOpen(!open);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex(Math.max(
              0,
              Math.min(crewRoles.length - 1, selectedIndex + (event.key === 'ArrowDown' ? 1 : -1)),
            ));
            setOpen(true);
          }
        }}
      >
        <span>{roleLabels[value]}</span>
        <Icon name="chevron-down" className="crew-role-select__arrow" />
      </button>
      {open && (
        <div className="crew-role-select__options" id={listboxId} role="listbox" aria-label="Crew role">
          {crewRoles.map((role, index) => (
            <button
              key={role}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              className={`crew-role-select__option ${role === value ? 'crew-role-select__option--active' : ''}`}
              role="option"
              aria-selected={role === value}
              tabIndex={-1}
              onClick={() => {
                onChange(role);
                setActiveIndex(index);
                setOpen(false);
                containerRef.current?.querySelector('button')?.focus();
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  focusOption(index + (event.key === 'ArrowDown' ? 1 : -1));
                } else if (event.key === 'Escape') {
                  event.preventDefault();
                  setOpen(false);
                  containerRef.current?.querySelector('button')?.focus();
                }
              }}
            >
              {roleLabels[role]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
            <CrewRoleDropdown
              value={member.role}
              onChange={(role) => dispatch({ type: 'updateCrew', id: member.id, patch: { role } })}
            />
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
              className="btn btn--danger crew__remove"
              onClick={() => dispatch({ type: 'removeCrew', id: member.id })}
              aria-label="Remove crew member"
            >
              <Icon name="close" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="btn" onClick={() => dispatch({ type: 'addCrew' })}>
        <Icon name="plus" /> Recruit crew
      </button>
    </Section>
  );
}
