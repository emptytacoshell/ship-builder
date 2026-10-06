import { useState } from 'react';
import { useBuild } from '../state/build';
import { buildShareUrl, saveToStorage } from '../lib/serialize';
import { Section } from './ui';

export function SaveShare() {
  const { build, dispatch } = useBuild();
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = () => {
    saveToStorage(build);
    setMessage('Build saved to this ship.');
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

  const handleReset = () => {
    dispatch({ type: 'reset' });
    setMessage('A fresh deck awaits.');
  };

  return (
    <Section title="Chart the Course">
      <div className="save-share">
        <button type="button" className="btn" onClick={handleSave}>
          Save Build
        </button>
        <button type="button" className="btn" onClick={handleShare}>
          Copy Share Link
        </button>
        <button type="button" className="btn btn--danger" onClick={handleReset}>
          Reset
        </button>
      </div>
      {message && <p className="save-share__msg">{message}</p>}
    </Section>
  );
}
