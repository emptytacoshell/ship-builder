import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';
export type Weather = 'clear' | 'windy' | 'storm';

export interface SceneState {
  timeOfDay: TimeOfDay;
  weather: Weather;
}

interface SceneContextValue {
  scene: SceneState;
  setTimeOfDay: (t: TimeOfDay) => void;
  setWeather: (w: Weather) => void;
}

const SceneContext = createContext<SceneContextValue | null>(null);

export function SceneProvider({ children }: { children: ReactNode }) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [weather, setWeather] = useState<Weather>('clear');
  const value = useMemo(
    () => ({ scene: { timeOfDay, weather }, setTimeOfDay, setWeather }),
    [timeOfDay, weather],
  );
  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export function useScene(): SceneContextValue {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error('useScene must be used within a SceneProvider');
  return ctx;
}
