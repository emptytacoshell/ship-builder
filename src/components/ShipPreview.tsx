import type { BuildState } from '../types/build';
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
        <Flag flag={build.flag} originX={mastXs[0]} originY={mastTopY(0)} fly={1} />

        {/* Hull */}
        <Hull build={build} geo={geo} />

        {/* Cannons (mounted across the hull's gun decks) */}
        <Cannons count={build.armament.cannonCount} geo={geo} />

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

function Hull({ build, geo }: { build: BuildState; geo: HullGeometry }) {
  const color = build.hull.color;
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
      {/* rudder under the stern */}
      <path d={`M ${sternKeelX} ${keelY - 4} q -16 22 -4 40 q 18 -6 22 -30 Z`} fill="#2a1a0e" />

      {/* main hull body */}
      <path d={hullPath} fill={color} stroke="#241408" strokeWidth={3} />
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

function Cannons({ count, geo }: { count: number; geo: HullGeometry }) {
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
              <g key={i}>
                <rect x={gx - gunSize} y={y - gunSize * 0.85} width={gunSize * 2} height={gunSize * 1.7} rx={2} fill="#160c05" />
                <line x1={gx} y1={y} x2={gx + gunSize * 2} y2={y - gunSize * 0.2} stroke="#2b2b2b" strokeWidth={gunSize * 0.55} strokeLinecap="round" />
                <circle cx={gx} cy={y} r={gunSize * 0.42} fill="#3d3d3d" />
              </g>
            ))}
          </g>
        );
      })}
    </g>
  );
}
