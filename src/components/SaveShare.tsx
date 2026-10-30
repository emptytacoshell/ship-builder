import { useState } from 'react';
import { useBuild } from '../state/build';
import { buildShareUrl, saveToStorage } from '../lib/serialize';
import { exportShipPng } from '../lib/exportPng';
import { Icon } from './Icon';

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
      <button type="button" className="scene-btn" aria-label="Save" title="Save" onClick={handleSave}>
        <Icon name="save" />
        <span className="visually-hidden">Save</span>
      </button>
      <button type="button" className="scene-btn" aria-label="Copy Link" title="Copy Link" onClick={handleShare}>
        <Icon name="link" />
        <span className="visually-hidden">Copy Link</span>
      </button>
      <button type="button" className="scene-btn" aria-label="Export PNG" title="Export PNG" onClick={handleExport}>
        <Icon name="download" />
        <span className="visually-hidden">Export PNG</span>
      </button>
      <button type="button" className="scene-btn scene-btn--danger" aria-label="Reset" title="Reset" onClick={handleReset}>
        <Icon name="reset" />
        <span className="visually-hidden">Reset</span>
      </button>
      {message && <p className="save-share__msg" role="status">{message}</p>}
    </div>
  );
}
