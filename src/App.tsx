import { useEffect, useMemo, useRef } from 'react';
import { BuildProvider, useBuild } from './state/build';
import { SceneProvider } from './state/scene';
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
import './App.css';

function ShipPreviewWrap() {
  const { build } = useBuild();
  return <ShipPreview build={build} background />;
}

function Builder() {
  const { build } = useBuild();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const update = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      el.classList.toggle('carousel--no-left-fade', el.scrollLeft < 2);
      el.classList.toggle('carousel--no-right-fade', el.scrollLeft > maxScroll - 2);
    };
    el.addEventListener('scroll', update);
    update();
    return () => el.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="builder">
      <header className="builder__header">
        <div className="builder__brand">
          <h1 className="builder__title">⚓ Pirate Ship Builder</h1>
          <p className="builder__tagline">Chart a vessel, man her crew, and set sail.</p>
        </div>
        <div className="builder__shipname">{build.name}</div>
      </header>

      <div className="builder__stage">
        <div className="builder__stage-bg" aria-hidden="true">
          <ShipPreviewWrap />
        </div>

        {/* Bare floating buttons on top of the rendering. */}
        <div className="builder__topbar">
          <SceneControls />
          <SaveShare />
        </div>

        {/* Middle row: Standing (left) and Manifest (right) fill the gap
            between the top bar and the carousel with equal margins. */}
        <div className="builder__mid">
          <div className="builder__left">
            <StatsPanel />
          </div>
          <div className="builder__right">
            <ShipManifest />
          </div>
        </div>

        {/* Frosted-glass panel carousel along the bottom. */}
        <div className="builder__carousel" ref={carouselRef}>
          <PartsPicker />
          <ShipNaming />
          <FlagDesigner />
          <FigureheadDesigner />
          <CrewRoster />
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
