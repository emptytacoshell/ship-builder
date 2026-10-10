import { useState } from 'react';
import { useBuild } from '../state/build';
import { buildShareUrl, saveToStorage } from '../lib/serialize';
import { exportShipPng } from '../lib/exportPng';

export function SaveShare() {
  const { build, dispatch } = useBuild();
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = () => {
    saveToStorage(build);
    setMessage('Build saved to this browser.');
  };

  const handleShare = async () => {
    const url = buildShareUrl(build);
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Share link copied!');
    } catch {
      window.open(url, '_blank');
      setMessage('Opened share link in a new tab.');
    }
  };

  const handleExport = () => {
    const svg = document.getElementById('ship-preview-svg') as SVGSVGElement | null;
    exportShipPng(svg, `${build.name.replace(/[^a-z0-9]/gi, '_')}_ship.png`);
    setMessage('PNG exported — check your downloads.');
  };

  const handleReset = () => {
    dispatch({ type: 'reset' });
    setMessage('A fresh deck awaits.');
  };

  return (
    <div className="save-share" role="group" aria-label="Chart the Course">
      <button type="button" className="scene-btn" onClick={handleSave}>
        Save
      </button>
      <button type="button" className="scene-btn" onClick={handleShare}>
        Copy Link
      </button>
      <button type="button" className="scene-btn" onClick={handleExport}>
        Export PNG
      </button>
      <button type="button" className="scene-btn scene-btn--danger" onClick={handleReset}>
        Reset
      </button>
      {message && <p className="save-share__msg">{message}</p>}
    </div>
  );
}
