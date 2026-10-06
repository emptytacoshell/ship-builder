import type { CSSProperties } from 'react';
import type { FlagSelection } from '../types/build';

interface FlagProps {
  flag: FlagSelection;
  width?: number;
  height?: number;
  originX?: number;
  originY?: number;
  /** 1 = flies to the right of the mast, -1 = to the left. */
  fly?: 1 | -1;
}

/** A single pennant/flag panel, used at the top of a mast. */
export function Flag({
  flag,
  width = 70,
  height = 42,
  originX = 0,
  originY = 0,
  fly = 1,
}: FlagProps) {
  const dir = fly;
  const x = originX;
  const y = originY;

  // Pattern overlay clipped to the flag rectangle.
  const pattern =
    flag.pattern === 'stripes' ? (
      <line x1={x} y1={y + height / 2} x2={x + dir * width} y2={y + height / 2} stroke="rgba(0,0,0,0.18)" strokeWidth={4} />
    ) : flag.pattern === 'checker' ? (
      <rect x={x} y={y} width={Math.abs(width) / 2} height={height} fill="rgba(0,0,0,0.15)" transform={dir === -1 ? `translate(${x * 2},0)` : undefined} />
    ) : flag.pattern === 'banner' ? (
      <rect x={x} y={y} width={Math.abs(width)} height={height / 2} fill="rgba(0,0,0,0.15)" />
    ) : null;

  return (
    <g style={{ ['--flag-bg' as string]: flag.background } as CSSProperties}>
      <path
        d={`M ${x} ${y} h ${dir * width} q ${dir * 6} ${height / 2} 0 ${height} h ${dir * -width} Z`}
        fill={flag.background}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth={1.5}
      />
      {pattern}
      <Emblem
        id={flag.emblem}
        cx={x + dir * (width * 0.55)}
        cy={y + height / 2}
        size={height * 0.6}
        color={flag.background === '#1b1b1b' || flag.background === '#111111' ? '#f0e6cf' : '#1b1b1b'}
      />
    </g>
  );
}

function Emblem({
  id,
  cx,
  cy,
  size,
  color,
}: {
  id: FlagSelection['emblem'];
  cx: number;
  cy: number;
  size: number;
  color: string;
}) {
  const s = size / 2;
  const common = { fill: 'none', stroke: color, strokeWidth: Math.max(1.5, size * 0.08), strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (id) {
    case 'skull': {
      const sw = Math.max(1.5, size * 0.08);
      // Crossed bones behind the skull.
      const bone = {
        stroke: color,
        strokeWidth: sw * 1.5,
        strokeLinecap: 'round' as const,
      };
      const head = cx;
      const headY = cy - s * 0.35;
      return (
        <g>
          {/* Crossed bones, sitting in the lower half so they stay visible. */}
          <line x1={head - s * 0.9} y1={cy + s * 0.95} x2={head + s * 0.9} y2={cy + s * 0.05} {...bone} />
          <line x1={head + s * 0.9} y1={cy + s * 0.95} x2={head - s * 0.9} y2={cy + s * 0.05} {...bone} />
          {/* skull head with a tapering jaw */}
          <path
            d={`M ${head - s * 0.55} ${headY - s * 0.5}
                A ${s * 0.55} ${s * 0.66} 0 1 1 ${head + s * 0.55} ${headY - s * 0.5}
                L ${head + s * 0.55} ${headY + s * 0.3}
                L ${head + s * 0.3} ${headY + s * 0.55}
                L ${head - s * 0.3} ${headY + s * 0.55}
                L ${head - s * 0.55} ${headY + s * 0.3}
                Z`}
            fill={color}
          />
          {/* eye sockets + nose, punched out in the flag color */}
          <circle cx={head - s * 0.24} cy={headY - s * 0.02} r={s * 0.15} fill="var(--flag-bg, #1b1b1b)" />
          <circle cx={head + s * 0.24} cy={headY - s * 0.02} r={s * 0.15} fill="var(--flag-bg, #1b1b1b)" />
          <path d={`M ${head} ${headY + s * 0.12} l ${s * 0.09} ${s * 0.2} l ${-s * 0.18} 0 Z`} fill="var(--flag-bg, #1b1b1b)" />
          {/* teeth */}
          <line x1={head - s * 0.26} y1={headY + s * 0.42} x2={head + s * 0.26} y2={headY + s * 0.42} stroke="var(--flag-bg, #1b1b1b)" strokeWidth={sw * 0.5} />
          <line x1={head - s * 0.09} y1={headY + s * 0.3} x2={head - s * 0.09} y2={headY + s * 0.42} stroke="var(--flag-bg, #1b1b1b)" strokeWidth={sw * 0.5} />
          <line x1={head + s * 0.09} y1={headY + s * 0.3} x2={head + s * 0.09} y2={headY + s * 0.42} stroke="var(--flag-bg, #1b1b1b)" strokeWidth={sw * 0.5} />
        </g>
      );
    }
    case 'anchor':
      return (
        <g {...common}>
          <line x1={cx} y1={cy - s} x2={cx} y2={cy + s} />
          <path d={`M ${cx - s * 0.5} ${cy + s * 0.5} Q ${cx} ${cy + s * 1.2} ${cx + s * 0.5} ${cy + s * 0.5}`} />
          <line x1={cx - s * 0.5} y1={cy - s * 0.4} x2={cx + s * 0.5} y2={cy - s * 0.4} />
        </g>
      );
    case 'serpent':
      return (
        <path
          d={`M ${cx - s} ${cy + s * 0.5} q ${s * 0.6} ${-s} ${s * 1.2} 0 q ${s * 0.6} ${s} ${s * 0.4} ${-s * 0.5}`}
          {...common}
        />
      );
    case 'compass':
      return (
        <g {...common}>
          <circle cx={cx} cy={cy} r={s * 0.9} />
          <line x1={cx} y1={cy - s * 0.9} x2={cx} y2={cy + s * 0.9} />
          <line x1={cx - s * 0.9} y1={cy} x2={cx + s * 0.9} y2={cy} />
        </g>
      );
    case 'crown':
      return (
        <path d={`M ${cx - s} ${cy + s * 0.6} L ${cx - s} ${cy - s * 0.3} L ${cx - s * 0.4} ${cy} L ${cx} ${cy - s * 0.6} L ${cx + s * 0.4} ${cy} L ${cx + s} ${cy - s * 0.3} L ${cx + s} ${cy + s * 0.6} Z`} fill={color} stroke="none" />
      );
    default:
      return null;
  }
}
