import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { BuildProvider, useBuild } from './state/build';
import { SceneProvider, useScene } from './state/scene';
import { resolveInitialBuild } from './lib/serialize';
import { ShipPreview } from './components/ShipPreview';
import { SceneControls } from './components/SceneControls';
import { PartsPicker } from './components/PartsPicker';
import { FlagDesigner } from './components/FlagDesigner';
import { FigureheadDesigner } from './components/FigureheadDesigner';
import { ShipNaming } from './components/ShipNaming';
import { StatsPanel } from './components/StatsPanel';
import { CrewRoster } from './components/CrewRoster';
import { SaveShare } from './components/SaveShare';
import { ShipManifest } from './components/ShipManifest';
import { Icon, type IconName } from './components/Icon';
import './App.css';

const PANEL_IDLE_TIMEOUT_MS = 10_000;

function ShipPreviewWrap({ panelOpen }: { panelOpen: boolean }) {
  const { build } = useBuild();
  return <ShipPreview build={build} background panelOpen={panelOpen} />;
}

function Builder() {
  const { build } = useBuild();
  const { scene } = useScene();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [panelActivity, setPanelActivity] = useState(0);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePanel(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    if (activePanel === null) return;

    const timeout = window.setTimeout(() => setActivePanel(null), PANEL_IDLE_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [activePanel, panelActivity]);

  const panels: {
    id: string;
    icon: IconName;
    label: string;
    content: ReactNode;
  }[] = [
    { id: 'class', icon: 'anchor', label: 'Ship class', content: <PartsPicker section="class" /> },
    { id: 'hull', icon: 'hull', label: 'Hull', content: <PartsPicker section="hull" /> },
    { id: 'rigging', icon: 'sails', label: 'Rigging', content: <PartsPicker section="rigging" /> },
    { id: 'armament', icon: 'swords', label: 'Armament', content: <PartsPicker section="armament" /> },
    { id: 'name', icon: 'edit', label: 'Ship name', content: <ShipNaming /> },
    { id: 'flag', icon: 'flag', label: 'Flag', content: <FlagDesigner /> },
    { id: 'figurehead', icon: 'figurehead', label: 'Figurehead', content: <FigureheadDesigner /> },
    { id: 'crew', icon: 'crew', label: 'Crew', content: <CrewRoster /> },
    { id: 'standing', icon: 'standing', label: "Ship's standing", content: <StatsPanel /> },
    { id: 'manifest', icon: 'manifest', label: 'Ship manifest', content: <ShipManifest /> },
  ];
  const editablePanels = panels.filter((panel) => panel.id !== 'standing' && panel.id !== 'manifest');
  const infoPanels = panels.filter((panel) => panel.id === 'standing' || panel.id === 'manifest');
  const selectedPanel = panels.find((panel) => panel.id === activePanel);
  const isInfoPanel = activePanel === 'standing' || activePanel === 'manifest';
  const headerSkyClass = scene.timeOfDay === 'dawn' || scene.timeOfDay === 'day'
    ? 'builder__header--bright-sky'
    : 'builder__header--dark-sky';
  const renderPanelButton = (panel: (typeof panels)[number]) => (
    <button
      key={panel.id}
      type="button"
      className={`builder__menu-item ${activePanel === panel.id ? 'builder__menu-item--active' : ''}`}
      aria-label={panel.label}
      aria-controls={activePanel === panel.id ? 'builder-panel' : undefined}
      aria-expanded={activePanel === panel.id}
      title={panel.label}
      onClick={() => setActivePanel(activePanel === panel.id ? null : panel.id)}
    >
      <Icon name={panel.icon} />
    </button>
  );

  return (
    <div className="builder">
      <header className={`builder__header ${headerSkyClass}`}>
        <div className="builder__brand">
          <h1 className="builder__title">Pirate Ship Builder</h1>
          <div className="builder__shipname" aria-live="polite">{build.name}</div>
        </div>
      </header>

      <div className="builder__stage">
        <div className={`builder__stage-bg ${scene.weather === 'storm' ? 'builder__stage-bg--storm' : ''}`} aria-hidden="true">
          <ShipPreviewWrap panelOpen={activePanel !== null} />
        </div>

        {/* Bare floating buttons on top of the rendering. */}
        <div className="builder__topbar">
          <SceneControls />
          <SaveShare />
        </div>

        <div className={`builder__workspace ${isInfoPanel ? 'builder__workspace--info' : ''}`}>
          <nav className="builder__menu" aria-label="Ship builder panels">
            {editablePanels.map(renderPanelButton)}
            <div className="builder__info-menu" role="group" aria-label="Ship information panels">
              {infoPanels.map(renderPanelButton)}
            </div>
          </nav>

          {selectedPanel && (
            <section
              className="builder__panel"
              id="builder-panel"
              aria-label={`${selectedPanel.label} panel`}
              onPointerDown={() => setPanelActivity((activity) => activity + 1)}
              onKeyDown={() => setPanelActivity((activity) => activity + 1)}
            >
              <div className="builder__panel-content">{selectedPanel.content}</div>
            </section>
          )}

          <div className="builder__scene-space" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function App() {
  const initial = useMemo(() => resolveInitialBuild(), []);
  return (
    <BuildProvider initial={initial ?? undefined}>
      <SceneProvider>
        <Builder />
      </SceneProvider>
    </BuildProvider>
  );
}

export default App
