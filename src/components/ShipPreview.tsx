import type { BuildState, CannonTierId } from '../types/build';
import { getShipClass, type HullGeometry } from '../data/shipClasses';
import { useScene, type TimeOfDay } from '../state/scene';
import { Flag } from './Flag';
import { Figurehead } from './Figurehead';

const VB_W = 800;
const VB_H = 460;
const WATER_Y = 360;
// Shift the whole scene upward so the hull clears the bottom carousel.
const SCENE_SHIFT = 110;

interface Palette {
  skyTop: string;
  skyBottom: string;
  sea: string;
  seaDeep: string;
  wave: string;
  celestial: string;
  celestialGlow: string;
}

const PALETTES: Record<TimeOfDay, Palette> = {
  dawn: { skyTop: '#f6c9a0', skyBottom: '#d98a6a', sea: '#3a5f6b', seaDeep: '#24424c', wave: '#d8b48a', celestial: '#ffd27f', celestialGlow: '#ffb35a' },
  day:  { skyTop: '#f2e2bd', skyBottom: '#d9b98a', sea: '#1f5a6b', seaDeep: '#0f2f3a', wave: '#bcd8dc', celestial: '#f4d98b', celestialGlow: '#f4d98b' },
  dusk: { skyTop: '#e08a5a', skyBottom: '#8a5a6b', sea: '#4a3a5a', seaDeep: '#241c33', wave: '#c98a6a', celestial: '#ff9a5a', celestialGlow: '#e06a3a' },
  night:{ skyTop: '#1b2a4d', skyBottom: '#0f1830', sea: '#12203a', seaDeep: '#080f1e', wave: '#3a5a7a', celestial: '#e8e8f0', celestialGlow: '#aab0cc' },
};

const STARS: ReadonlyArray<readonly [number, number]> = [
  [80, 60], [150, 100], [230, 40], [320, 90], [410, 50],
  [500, 110], [590, 60], [680, 90], [740, 40], [120, 140],
  [380, 140], [620, 150], [270, 70], [700, 120],
];

export function ShipPreview({ build, background = false }: { build: BuildState; background?: boolean }) {
  const { scene } = useScene();
  const { timeOfDay, weather } = scene;
  const palette = PALETTES[timeOfDay];

  const isNight = timeOfDay === 'night';
  const isStorm = weather === 'storm';
  const isWindy = weather === 'windy';

  const shipClass = getShipClass(build.shipClassId);
  const masts = Math.min(build.rigging.mastCount, shipClass.maxMasts);
  const geo = shipClass.hull;

  const cx = VB_W / 2;
  const deckY = WATER_Y - geo.freeboard;
  const bowX = cx + geo.halfLen;

  // Spread masts across the deck, scaled to the ship's size.
  const mastSpan = geo.halfLen * 1.4;
  const startX = cx - mastSpan / 2;
  const mastLen = 120 + geo.freeboard * 0.35;
  const mastTopY = (i: number) => deckY - mastLen - (i % 2) * 14;
  const mastXs =
    masts === 1 ? [cx] : Array.from({ length: masts }, (_, i) => startX + (mastSpan / (masts - 1)) * i);

  return (
    <svg
      id="ship-preview-svg"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className={background ? 'ship-preview ship-preview--bg' : 'ship-preview'}
      preserveAspectRatio={background ? 'xMidYMin slice' : 'xMidYMid meet'}
      role="img"
      aria-label={build.name}
    >
      <style>{`
        @keyframes ship-bob {
          0%   { transform: translateY(0px) rotate(0deg); }
          50%  { transform: translateY(5px) rotate(-0.6deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes wave-drift { from { transform: translateX(0); } to { transform: translateX(-80px); } }
        @keyframes wave-drift-slow { from { transform: translateX(0); } to { transform: translateX(80px); } }
        @keyframes cloud-drift { from { transform: translateX(-120px); } to { transform: translateX(900px); } }
        @keyframes rain-fall { from { transform: translateY(-60px); } to { transform: translateY(480px); } }
        @keyframes lightning { 0%, 92%, 100% { opacity: 0; } 93%, 95% { opacity: 0.5; } 94% { opacity: 0.15; } }
        @keyframes celestial-pulse { 0%, 100% { opacity: 0.75; } 50% { opacity: 0.95; } }
        .ship-bob { animation: ship-bob 4.5s ease-in-out infinite; transform-origin: ${cx}px ${WATER_Y}px; }
        .wave-a { animation: wave-drift ${isStorm ? 3 : 7}s linear infinite; }
        .wave-b { animation: wave-drift-slow ${isStorm ? 4 : 9}s linear infinite; }
        .cloud { animation: cloud-drift ${isWindy ? 14 : 40}s linear infinite; }
        .rain-drop { animation: rain-fall 0.7s linear infinite; }
        .lightning { animation: lightning 5s linear infinite; }
        .celestial { animation: celestial-pulse 5s ease-in-out infinite; }
      `}</style>
      <defs>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.sea} />
          <stop offset="100%" stopColor={palette.seaDeep} />
        </linearGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.skyTop} />
          <stop offset="100%" stopColor={palette.skyBottom} />
        </linearGradient>
        <linearGradient id="hullShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00000000" />
          <stop offset="100%" stopColor="#00000040" />
        </linearGradient>
        <WoodGrainPatterns />
      </defs>

      <g transform={`translate(0 ${-SCENE_SHIFT})`}>
      {/* Sky */}
      <rect x={0} y={0} width={VB_W} height={WATER_Y} fill="url(#sky)" />

      {/* Stars at night */}
      {isNight && (
        <g fill="#ffffff">
          {STARS.map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={i % 3 === 0 ? 1.6 : 1} opacity={0.9} />
          ))}
        </g>
      )}

      {/* Sun / moon */}
      <circle cx={650} cy={90} r={60} fill={palette.celestialGlow} opacity={0.18} />
      <circle className="celestial" cx={650} cy={90} r={isNight ? 26 : 44} fill={palette.celestial} opacity={0.9} />

      {/* Clouds when windy or in a storm */}
      {(isWindy || isStorm) && (
        <g fill={isStorm ? '#3a4150' : '#ffffff'} opacity={isStorm ? 0.8 : 0.7}>
          <g className="cloud">
            <Cloud x={-40} y={70} scale={1} />
            <Cloud x={420} y={50} scale={1.3} />
          </g>
        </g>
      )}

      {/* Sea */}
      <rect x={0} y={WATER_Y} width={VB_W} height={VB_H - WATER_Y + SCENE_SHIFT} fill="url(#sea)" />

      {/* Animated waves */}
      <g className="wave-a" stroke={palette.wave} strokeWidth={2} fill="none" opacity={isStorm ? 0.7 : 0.5}>
        <path d={`M -80 ${WATER_Y + 20} q 40 -10 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`} />
      </g>
      <g className="wave-b" stroke={palette.wave} strokeWidth={2} fill="none" opacity={isStorm ? 0.55 : 0.35}>
        <path d={`M -80 ${WATER_Y + 42} q 40 -8 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`} />
      </g>

      {/* The ship, gently bobbing on the water */}
      <g className="ship-bob">
        {/* Sails + masts */}
        {mastXs.map((mx, i) => (
          <g key={i}>
            <line x1={mx} y1={mastTopY(i)} x2={mx} y2={deckY} stroke="#3a2417" strokeWidth={5} />
            <Sail style={build.rigging.sailStyle} color={build.rigging.sailColor} x={mx} top={mastTopY(i)} deckY={deckY} />
          </g>
        ))}

        {/* Flag on the rearmost (leftmost) mast */}
        <Flag flag={build.flag} originX={mastXs[0]!} originY={mastTopY(0)} fly={1} />

        {/* Hull */}
        <Hull build={build} geo={geo} />

        {/* Cannons (mounted across the hull's gun decks) */}
        <Cannons count={build.armament.cannonCount} tier={build.armament.cannonTier} geo={geo} />

        {/* Figurehead at the bow (front of the hull) */}
        <Figurehead figurehead={build.figurehead} x={bowX - 12} y={deckY + 16} scale={1.1} />
      </g>

      {/* Rain for a storm */}
      {isStorm && (
        <g stroke="#9fb8c9" strokeWidth={1.5} opacity={0.6}>
          {Array.from({ length: 40 }, (_, i) => {
            const x = (i * 53) % VB_W;
            return (
              <line key={i} className="rain-drop" x1={x} y1={-20} x2={x - 10} y2={10} style={{ animationDelay: `${(i % 8) * 0.09}s` }} />
            );
          })}
        </g>
      )}

      {/* Lightning flash + storm dimming */}
      {isStorm && <rect className="lightning" x={0} y={0} width={VB_W} height={VB_H} fill="#ffffff" opacity={0} />}
      {isStorm && <rect x={0} y={0} width={VB_W} height={VB_H} fill="#0a1520" opacity={0.25} />}
      </g>
    </svg>
  );
}

function Cloud({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={0} rx={46} ry={20} />
      <ellipse cx={36} cy={6} rx={40} ry={22} />
      <ellipse cx={-34} cy={8} rx={34} ry={18} />
      <ellipse cx={12} cy={-12} rx={32} ry={18} />
    </g>
  );
}

function Sail({
  style,
  color,
  x,
  top,
  deckY,
}: {
  style: BuildState['rigging']['sailStyle'];
  color: string;
  x: number;
  top: number;
  deckY: number;
}) {
  const w = 90;
  const h = deckY - top;
  const midY = top + h / 2;
  const fill = color;

  if (style === 'square') {
    return (
      <g fill={fill} stroke="#00000022" strokeWidth={1.5}>
        <rect x={x - w / 2} y={top + 10} width={w} height={h * 0.4} rx={3} />
        <rect x={x - w / 2 + 6} y={top + h * 0.45} width={w - 12} height={h * 0.4} rx={3} />
      </g>
    );
  }
  if (style === 'lateen') {
    return (
      <path
        d={`M ${x - w * 0.6} ${midY} L ${x} ${top} L ${x + w * 0.1} ${deckY - 6} Z`}
        fill={fill}
        stroke="#00000022"
        strokeWidth={1.5}
      />
    );
  }
  if (style === 'gaff') {
    return (
      <path
        d={`M ${x + 8} ${top + 6} L ${x + w * 0.6} ${top + h * 0.35} L ${x + 8} ${deckY - 6} L ${x - w * 0.15} ${deckY - 6} Z`}
        fill={fill}
        stroke="#00000022"
        strokeWidth={1.5}
      />
    );
  }
  // scratched
  return (
    <path
      d={`M ${x - w / 2} ${top + 10} h ${w} q ${w * 0.3} ${h * 0.4} 0 ${h * 0.8} h ${-w} Z`}
      fill={fill}
      stroke="#00000033"
      strokeWidth={1.5}
    />
  );
}

/** SVG pattern definitions for wood grain textures per wood type. */
function WoodGrainPatterns() {
  return (
    <>
      {/* Oak: classic straight grain with slight wave */}
      <pattern id="wood-grain-oak" width="20" height="40" patternUnits="userSpaceOnUse">
        <path d="M 2 0 Q 4 10 2 20 Q 0 30 3 40" stroke="#2a1508" fill="none" strokeWidth="1.5" opacity="0.3" />
        <path d="M 8 0 Q 10 12 8 24 Q 6 34 9 40" stroke="#2a1508" fill="none" strokeWidth="1" opacity="0.2" />
        <path d="M 14 0 Q 16 8 14 20 Q 12 32 15 40" stroke="#1a0f05" fill="none" strokeWidth="1.2" opacity="0.25" />
        <path d="M 0 10 Q 5 12 10 10 Q 15 8 20 10" stroke="#1a0f05" fill="none" strokeWidth="0.8" opacity="0.12" />
      </pattern>

      {/* Walnut: rich cathedral / wavy grain */}
      <pattern id="wood-grain-walnut" width="30" height="50" patternUnits="userSpaceOnUse">
        <path d="M 0 5 Q 8 0 15 5 Q 22 10 30 5" stroke="#1a0f08" fill="none" strokeWidth="2" opacity="0.3" />
        <path d="M 0 15 Q 10 10 15 15 Q 20 20 30 15" stroke="#1a0f08" fill="none" strokeWidth="1.5" opacity="0.2" />
        <path d="M 0 25 Q 5 22 15 25 Q 25 28 30 25" stroke="#2a1810" fill="none" strokeWidth="1" opacity="0.25" />
        <path d="M 0 35 Q 12 30 15 35 Q 18 40 30 35" stroke="#1a0f08" fill="none" strokeWidth="2" opacity="0.3" />
        <path d="M 0 45 Q 8 42 15 45 Q 22 48 30 45" stroke="#1a0f08" fill="none" strokeWidth="1.5" opacity="0.2" />
      </pattern>

      {/* Ironwood: very dense, tight parallel lines */}
      <pattern id="wood-grain-ironwood" width="12" height="30" patternUnits="userSpaceOnUse">
        <line x1="2" y1="0" x2="2" y2="30" stroke="#0a0604" strokeWidth="1.2" opacity="0.35" />
        <line x1="5" y1="0" x2="5" y2="30" stroke="#0a0604" strokeWidth="0.8" opacity="0.25" />
        <line x1="8" y1="0" x2="8" y2="30" stroke="#0a0604" strokeWidth="1.4" opacity="0.3" />
        <line x1="11" y1="0" x2="11" y2="30" stroke="#0a0604" strokeWidth="0.7" opacity="0.2" />
      </pattern>

      {/* Driftwood: weathered, broken grain with knots */}
      <pattern id="wood-grain-driftwood" width="24" height="36" patternUnits="userSpaceOnUse">
        <path d="M 3 0 L 3 8 M 3 14 L 3 22 M 3 28 L 3 36" stroke="#7a8a8a" fill="none" strokeWidth="1.5" opacity="0.35" />
        <path d="M 10 0 L 10 5 M 10 12 L 10 18 M 10 26 L 10 36" stroke="#6a7a7a" fill="none" strokeWidth="1" opacity="0.3" />
        <path d="M 17 0 L 17 10 M 17 16 L 17 20 M 17 28 L 17 33" stroke="#7a8a8a" fill="none" strokeWidth="1.2" opacity="0.25" />
        <ellipse cx="7" cy="30" rx="3" ry="4" stroke="#5a6a6a" fill="none" strokeWidth="0.8" opacity="0.3" />
        <path d="M 20 4 L 22 8 L 20 12" stroke="#8a9a9a" fill="none" strokeWidth="0.8" opacity="0.25" />
      </pattern>

      {/* Teak: fine, straight golden grain */}
      <pattern id="wood-grain-teak" width="16" height="40" patternUnits="userSpaceOnUse">
        <path d="M 3 0 Q 4 20 3 40" stroke="#5a3a10" fill="none" strokeWidth="0.8" opacity="0.25" />
        <path d="M 8 0 Q 9 15 8 30 Q 7 35 8 40" stroke="#5a3a10" fill="none" strokeWidth="1" opacity="0.3" />
        <path d="M 13 0 Q 14 10 13 25 Q 12 35 13 40" stroke="#6a4a18" fill="none" strokeWidth="0.7" opacity="0.2" />
      </pattern>

      {/* Ebony: very subtle, dark fine grain */}
      <pattern id="wood-grain-ebony" width="14" height="35" patternUnits="userSpaceOnUse">
        <path d="M 3 0 Q 4 17 3 35" stroke="#050302" fill="none" strokeWidth="1" opacity="0.45" />
        <path d="M 9 0 Q 10 17 9 35" stroke="#050302" fill="none" strokeWidth="0.8" opacity="0.35" />
      </pattern>
    </>
  );
}

function Hull({ build, geo }: { build: BuildState; geo: HullGeometry }) {
  const color = build.hull.color;
  const wood = build.hull.wood;
  const cx = VB_W / 2;
  const deckY = WATER_Y - geo.freeboard;
  const keelY = WATER_Y + geo.keel;
  const sternX = cx - geo.halfLen;
  const bowX = cx + geo.halfLen;

  const sheer = geo.freeboard * 0.14;
  const sternKeelX = sternX + geo.halfLen * 0.2;
  const bowKeelX = bowX - geo.halfLen * 0.14;
  const keelBulge = geo.keel * 0.42;

  const hullPath = `M ${sternX} ${deckY}
    Q ${cx} ${deckY + sheer} ${bowX} ${deckY}
    L ${bowKeelX} ${keelY}
    Q ${cx} ${keelY + keelBulge} ${sternKeelX} ${keelY}
    Z`;

  const sternW = geo.halfLen * 0.16;
  const sternTop = deckY - geo.sternH;

  return (
    <g>
      <defs>
        <clipPath id="hull-clip">
          <path d={hullPath} />
        </clipPath>
      </defs>

      {/* rudder under the stern */}
      <path d={`M ${sternKeelX} ${keelY - 4} q -16 22 -4 40 q 18 -6 22 -30 Z`} fill="#2a1a0e" />

      {/* main hull body */}
      <path d={hullPath} fill={color} stroke="#241408" strokeWidth={3} />

      {/* wood grain overlay, clipped to hull shape */}
      <g clipPath="url(#hull-clip)">
        <rect x={sternX} y={sternTop} width={bowX - sternX} height={keelY + keelBulge - sternTop} fill={`url(#wood-grain-${wood})`} />
      </g>

      <path d={hullPath} fill="url(#hullShade)" />

      {/* sterncastle (raised stern) */}
      <path
        d={`M ${sternX} ${deckY}
            L ${sternX} ${sternTop}
            Q ${sternX + sternW * 0.4} ${sternTop - 8} ${sternX + sternW} ${sternTop}
            L ${sternX + sternW} ${deckY}
            Z`}
        fill={color}
        stroke="#241408"
        strokeWidth={3}
      />
      {/* sterncastle wood grain */}
      <path
        d={`M ${sternX} ${deckY}
            L ${sternX} ${sternTop}
            Q ${sternX + sternW * 0.4} ${sternTop - 8} ${sternX + sternW} ${sternTop}
            L ${sternX + sternW} ${deckY}
            Z`}
        fill={`url(#wood-grain-${wood})`}
        opacity={0.7}
      />
      {/* stern windows */}
      <circle cx={sternX + sternW * 0.5} cy={sternTop + geo.sternH * 0.45} r={Math.max(3, sternW * 0.18)} fill="#f2d488" stroke="#241408" strokeWidth={1.5} />
      <circle cx={sternX + sternW * 0.5} cy={sternTop + geo.sternH * 0.75} r={Math.max(3, sternW * 0.18)} fill="#f2d488" stroke="#241408" strokeWidth={1.5} />

      {/* bowsprit from the bow */}
      {geo.bowsprit && (
        <g stroke="#3a2417" strokeLinecap="round">
          <line x1={bowX - 6} y1={deckY + 4} x2={bowX + 44} y2={deckY - 26} strokeWidth={5} />
          <line x1={bowX + 44} y1={deckY - 26} x2={bowX + 30} y2={deckY + 6} strokeWidth={3} />
        </g>
      )}

      {/* sheer (top rail) */}
      <path d={`M ${sternX} ${deckY} Q ${cx} ${deckY + sheer} ${bowX} ${deckY}`} fill="none" stroke="#241408" strokeWidth={3} />

      {/* planking / strakes */}
      <g stroke="#24140855" strokeWidth={2} fill="none">
        <path d={`M ${sternX + 8} ${deckY + geo.freeboard * 0.4} Q ${cx} ${deckY + sheer + geo.freeboard * 0.4} ${bowX - 26} ${deckY + geo.freeboard * 0.4}`} />
        <path d={`M ${sternX + 16} ${keelY - geo.keel * 0.4} Q ${cx} ${keelY + keelBulge * 0.5} ${bowKeelX - 6} ${keelY - geo.keel * 0.4}`} />
      </g>
    </g>
  );
}

function Cannons({ count, tier, geo }: { count: number; tier: CannonTierId; geo: HullGeometry }) {
  if (count <= 0) return null;
  const cx = VB_W / 2;
  const deckY = WATER_Y - geo.freeboard;
  const keelY = WATER_Y + geo.keel;

  // Gun area stays inside the hull body (clearing the sterncastle and bow).
  const leftX = cx - geo.halfLen * 0.78;
  const rightX = cx + geo.halfLen * 0.8;
  const topY = deckY + geo.freeboard * 0.3;
  const bottomY = keelY - geo.keel * 0.18;

  const decks = Math.max(1, Math.min(geo.gunDecks, 3));
  const maxPerDeck = 14;

  // Distribute the guns across the gun decks.
  const base = Math.floor(count / decks);
  const extra = count % decks;
  const rows = Array.from({ length: decks }, (_, d) =>
    Math.min(base + (d < extra ? 1 : 0), maxPerDeck),
  );

  const rowH = (bottomY - topY) / decks;
  const gunSize = Math.min(9, rowH * 0.4);
  const span = rightX - leftX;

  return (
    <g>
      {rows.map((n, d) => {
        const y = topY + rowH * (d + 0.5);
        const xs =
          n === 1
            ? [cx]
            : Array.from({ length: n }, (_, i) => leftX + (span / (n - 1)) * i);
        return (
          <g key={d}>
            {xs.map((gx, i) => (
              <CannonShape key={i} x={gx} y={y} size={gunSize} tier={tier} />
            ))}
          </g>
        );
      })}
    </g>
  );
}

/** Renders a single cannon with a distinct shape per tier. */
function CannonShape({ x, y, size, tier }: { x: number; y: number; size: number; tier: CannonTierId }) {
  const s = size; // shorthand
  switch (tier) {
    case 'blunderbuss':
      // Tiny body with a very short stubby barrel
      return (
        <g>
          <ellipse cx={x} cy={y} rx={s * 0.5} ry={s * 0.45} fill="#1a0e06" stroke="#2a1a0a" strokeWidth={0.8} />
          <line x1={x + s * 0.3} y1={y} x2={x + s * 0.8} y2={y} stroke="#3a3a3a" strokeWidth={s * 0.3} strokeLinecap="round" />
        </g>
      );
    case 'swivel':
      // Small body on a visible pivot mount, short barrel angled slightly up
      return (
        <g>
          <rect x={x - s * 0.55} y={y + s * 0.3} width={s * 1.1} height={s * 0.35} rx={1.5} fill="#2a1a0e" />
          <circle cx={x} cy={y} r={s * 0.4} fill="#1e1208" stroke="#3a2a18" strokeWidth={0.8} />
          <line x1={x} y1={y} x2={x + s * 1.1} y2={y - s * 0.4} stroke="#444" strokeWidth={s * 0.35} strokeLinecap="round" />
          <circle cx={x + s * 1.1} cy={y - s * 0.4} r={s * 0.15} fill="#555" />
        </g>
      );
    case 'demi':
      // Medium standard rectangular body, medium barrel
      return (
        <g>
          <rect x={x - s * 0.8} y={y - s * 0.6} width={s * 1.6} height={s * 1.2} rx={2} fill="#160c05" />
          <line x1={x + s * 0.6} y1={y} x2={x + s * 1.8} y2={y} stroke="#2b2b2b" strokeWidth={s * 0.45} strokeLinecap="round" />
          <circle cx={x} cy={y} r={s * 0.3} fill="#3d3d3d" />
        </g>
      );
    case 'long':
      // Elongated thin barrel, narrower profile
      return (
        <g>
          <rect x={x - s * 0.7} y={y - s * 0.45} width={s * 1.4} height={s * 0.9} rx={1.5} fill="#120a04" />
          <line x1={x + s * 0.5} y1={y} x2={x + s * 2.4} y2={y} stroke="#2e2e2e" strokeWidth={s * 0.3} strokeLinecap="round" />
          <line x1={x + s * 2.4} y1={y - s * 0.12} x2={x + s * 2.4} y2={y + s * 0.12} stroke="#444" strokeWidth={s * 0.18} />
        </g>
      );
    case 'culverin':
      // Thick wide barrel, bulky body
      return (
        <g>
          <rect x={x - s * 0.9} y={y - s * 0.75} width={s * 1.8} height={s * 1.5} rx={2.5} fill="#0e0804" />
          <rect x={x - s * 0.9} y={y - s * 0.75} width={s * 1.8} height={s * 0.4} rx={2} fill="#1a1008" opacity={0.5} />
          <line x1={x + s * 0.7} y1={y} x2={x + s * 1.9} y2={y} stroke="#333" strokeWidth={s * 0.65} strokeLinecap="round" />
          <circle cx={x} cy={y} r={s * 0.38} fill="#4a4a4a" />
        </g>
      );
    case 'naval':
      // Large barrel with a distinctive muzzle band ring
      return (
        <g>
          <rect x={x - s * 0.85} y={y - s * 0.7} width={s * 1.7} height={s * 1.4} rx={2} fill="#0c0703" />
          <line x1={x + s * 0.6} y1={y} x2={x + s * 2.1} y2={y} stroke="#2a2a2a" strokeWidth={s * 0.55} strokeLinecap="round" />
          {/* muzzle band */}
          <rect x={x + s * 1.95} y={y - s * 0.35} width={s * 0.2} height={s * 0.7} rx={1} fill="#5a5a5a" />
          <circle cx={x} cy={y} r={s * 0.35} fill="#484848" />
        </g>
      );
    case 'mortar':
      // Squat wide cylinder, short wide bore pointing slightly upward
      return (
        <g>
          <ellipse cx={x} cy={y} rx={s * 0.85} ry={s * 0.6} fill="#0a0603" stroke="#1e1408" strokeWidth={1} />
          <ellipse cx={x + s * 0.3} cy={y - s * 0.15} rx={s * 0.45} ry={s * 0.35} fill="#1a1208" />
          <line x1={x + s * 0.5} y1={y - s * 0.1} x2={x + s * 1.1} y2={y - s * 0.5} stroke="#3a3a3a" strokeWidth={s * 0.5} strokeLinecap="round" />
          <circle cx={x + s * 1.1} cy={y - s * 0.5} r={s * 0.2} fill="#555" />
        </g>
      );
    default:
      // 'none' — nothing to draw
      return null;
  }
}
