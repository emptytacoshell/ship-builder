import { useMemo } from 'react';
import { BuildProvider, useBuild } from './state/build';
import { resolveInitialBuild } from './lib/serialize';
import { ShipPreview } from './components/ShipPreview';
import { PartsPicker } from './components/PartsPicker';
import { FlagDesigner } from './components/FlagDesigner';
import { FigureheadDesigner } from './components/FigureheadDesigner';
import { ShipNaming } from './components/ShipNaming';
import { StatsPanel } from './components/StatsPanel';
import { CrewRoster } from './components/CrewRoster';
import { SaveShare } from './components/SaveShare';
import { ShipManifest } from './components/ShipManifest';
import './App.css';

function ShipPreviewWrap() {
  const { build } = useBuild();
  return <ShipPreview build={build} />;
}

function Builder() {
  return (
    <div className="builder">
      <header className="builder__header">
        <h1 className="builder__title">⚓ Pirate Ship Builder</h1>
        <p className="builder__tagline">Chart a vessel, man her crew, and set sail.</p>
      </header>

      <div className="builder__grid">
        <div className="builder__col builder__col--left">
          <PartsPicker />
        </div>

        <div className="builder__col builder__col--center">
          <div className="preview-card">
            <ShipPreviewWrap />
          </div>
          <StatsPanel />
        </div>

        <div className="builder__col builder__col--right">
          <ShipNaming />
          <FlagDesigner />
          <FigureheadDesigner />
          <CrewRoster />
          <SaveShare />
          <ShipManifest />
        </div>
      </div>
    </div>
  );
}

function App() {
  const initial = useMemo(() => resolveInitialBuild(), []);
  return (
    <BuildProvider initial={initial ?? undefined}>
      <Builder />
    </BuildProvider>
  );
}

export default App
