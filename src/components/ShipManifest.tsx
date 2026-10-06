import { useMemo, useState } from 'react';
import { useBuild } from '../state/build';
import { buildManifest } from '../lib/manifest';
import { statLabels } from '../lib/stats';
import { Section } from './ui';

export function ShipManifest() {
  const { build, stats } = useBuild();
  const [copied, setCopied] = useState(false);
  const manifest = useMemo(() => buildManifest(build, stats), [build, stats]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(manifest);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Section title="Ship's Manifest">
      <pre className="manifest">{manifest}</pre>
      <button type="button" className="btn" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy Manifest'}
      </button>
      <span className="manifest__keys">
        {statLabels.speed} · {statLabels.firepower} · {statLabels.durability} · {statLabels.cargo}
      </span>
    </Section>
  );
}
