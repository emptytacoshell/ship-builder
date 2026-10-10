import { useScene, type TimeOfDay, type Weather } from '../state/scene';

const timeOptions: { id: TimeOfDay; label: string }[] = [
  { id: 'dawn', label: 'Dawn' },
  { id: 'day', label: 'Day' },
  { id: 'dusk', label: 'Dusk' },
  { id: 'night', label: 'Night' },
];

const weatherOptions: { id: Weather; label: string }[] = [
  { id: 'clear', label: 'Clear' },
  { id: 'windy', label: 'Windy' },
  { id: 'storm', label: 'Storm' },
];

export function SceneControls() {
  const { scene, setTimeOfDay, setWeather } = useScene();

  return (
    <div className="scene-controls" role="group" aria-label="The Sea Around You">
      <span className="scene-controls__label">Time</span>
      {timeOptions.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`scene-btn ${scene.timeOfDay === opt.id ? 'scene-btn--active' : ''}`}
          onClick={() => setTimeOfDay(opt.id)}
        >
          {opt.label}
        </button>
      ))}
      <span className="scene-controls__divider" aria-hidden="true" />
      <span className="scene-controls__label">Weather</span>
      {weatherOptions.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`scene-btn ${scene.weather === opt.id ? 'scene-btn--active' : ''}`}
          onClick={() => setWeather(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
