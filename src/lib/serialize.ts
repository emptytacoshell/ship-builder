import type { BuildState } from '../types/build';
import { shipClasses } from '../data/shipClasses';
import { getShipClass } from '../data/shipClasses';

const STORAGE_KEY = 'pirate-ship-builder:last-build';

/** Encode a build into a compact, URL-safe token. */
export function encodeBuild(build: BuildState): string {
  const json = JSON.stringify(build);
  // base64url for safe embedding in query strings.
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Decode a token produced by encodeBuild. Returns null if invalid. */
export function decodeBuild(token: string): BuildState | null {
  try {
    let padded = token.replace(/-/g, '+').replace(/_/g, '/');
    while (padded.length % 4 !== 0) padded += '=';
    const json = decodeURIComponent(escape(atob(padded)));
    const parsed = JSON.parse(json) as BuildState;
    if (!parsed || !parsed.shipClassId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveToStorage(build: BuildState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(build));
  } catch {
    // Storage unavailable (private mode / quota) — fail silently.
  }
}

export function loadFromStorage(): BuildState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BuildState;
  } catch {
    return null;
  }
}

/**
 * Determine the initial build: prefer a build encoded in the URL query
 * string (?build=...), then the last saved build, then the default.
 */
export function resolveInitialBuild(): BuildState | null {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('build');
  if (fromUrl) {
    const decoded = decodeBuild(fromUrl);
    if (decoded && shipClasses.some((c) => c.id === decoded.shipClassId)) {
      return decoded;
    }
  }
  return loadFromStorage();
}

/** Build a shareable link (absolute URL with the encoded build). */
export function buildShareUrl(build: BuildState): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('build', encodeBuild(build));
  return url.toString();
}

export function classLabel(id: BuildState['shipClassId']): string {
  return getShipClass(id).label;
}
