import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type {
  ArmamentSelection,
  BuildState,
  CrewMember,
  FigureheadSelection,
  FlagSelection,
  HullSelection,
  RiggingSelection,
  ShipClassId,
  Stats,
} from '../types/build';
import { getShipClass, shipClasses } from '../data/shipClasses';
import { computeStats } from '../lib/stats';

export interface BuildContextValue {
  build: BuildState;
  stats: Stats;
  dispatch: Dispatch<BuildAction>;
}

function defaultBuild(): BuildState {
  const first = shipClasses[0];
  return { shipClassId: first.id, ...first.defaultBuild, crew: [] };
}

export type BuildAction =
  | { type: 'setName'; name: string }
  | { type: 'setShipClass'; shipClassId: ShipClassId }
  | { type: 'setHull'; hull: Partial<HullSelection> }
  | { type: 'setRigging'; rigging: Partial<RiggingSelection> }
  | { type: 'setArmament'; armament: Partial<ArmamentSelection> }
  | { type: 'setFlag'; flag: Partial<FlagSelection> }
  | { type: 'setFigurehead'; figurehead: Partial<FigureheadSelection> }
  | { type: 'addCrew' }
  | { type: 'updateCrew'; id: string; patch: Partial<CrewMember> }
  | { type: 'removeCrew'; id: string }
  | { type: 'replaceBuild'; build: BuildState }
  | { type: 'reset' };

function clampToClass(build: BuildState): BuildState {
  const shipClass = getShipClass(build.shipClassId);
  return {
    ...build,
    rigging: {
      ...build.rigging,
      mastCount: Math.min(Math.max(1, build.rigging.mastCount), shipClass.maxMasts),
    },
    armament: {
      ...build.armament,
      cannonCount: Math.min(Math.max(0, build.armament.cannonCount), shipClass.maxCannons),
    },
  };
}

function reducer(state: BuildState, action: BuildAction): BuildState {
  switch (action.type) {
    case 'setName':
      return { ...state, name: action.name };
    case 'setShipClass': {
      const shipClass = getShipClass(action.shipClassId);
      return clampToClass({
        ...state,
        shipClassId: action.shipClassId,
        name: state.name,
        crew: state.crew,
        hull: shipClass.defaultBuild.hull,
        rigging: {
          ...shipClass.defaultBuild.rigging,
          mastCount: shipClass.defaultMasts,
        },
        armament: shipClass.defaultBuild.armament,
        flag: state.flag,
        figurehead: state.figurehead,
      });
    }
    case 'setHull':
      return { ...state, hull: { ...state.hull, ...action.hull } };
    case 'setRigging':
      return clampToClass({ ...state, rigging: { ...state.rigging, ...action.rigging } });
    case 'setArmament':
      return clampToClass({ ...state, armament: { ...state.armament, ...action.armament } });
    case 'setFlag':
      return { ...state, flag: { ...state.flag, ...action.flag } };
    case 'setFigurehead':
      return { ...state, figurehead: { ...state.figurehead, ...action.figurehead } };
    case 'addCrew': {
      const member: CrewMember = {
        id: crypto.randomUUID(),
        name: `Crew ${state.crew.length + 1}`,
        role: 'cook',
        skill: 3,
      };
      return { ...state, crew: [...state.crew, member] };
    }
    case 'updateCrew':
      return {
        ...state,
        crew: state.crew.map((m) => (m.id === action.id ? { ...m, ...action.patch } : m)),
      };
    case 'removeCrew':
      return { ...state, crew: state.crew.filter((m) => m.id !== action.id) };
    case 'replaceBuild':
      return clampToClass(action.build);
    case 'reset':
      return defaultBuild();
    default:
      return state;
  }
}

const BuildContext = createContext<BuildContextValue | null>(null);

export function BuildProvider({ children, initial }: { children: ReactNode; initial?: BuildState }) {
  const [build, dispatch] = useReducer(reducer, initial ?? defaultBuild(), clampToClass);
  const stats = useMemo(() => computeStats(build), [build]);
  const value = useMemo(() => ({ build, stats, dispatch }), [build, stats]);
  return <BuildContext.Provider value={value}>{children}</BuildContext.Provider>;
}

export function useBuild(): BuildContextValue {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error('useBuild must be used within a BuildProvider');
  return ctx;
}
