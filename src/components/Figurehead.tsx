import type { FigureheadSelection } from '../types/build';

/** Renders a bow figurehead at the given point, facing the bow (up/left). */
export function Figurehead({
  figurehead,
  x,
  y,
  scale = 1,
}: {
  figurehead: FigureheadSelection;
  x: number;
  y: number;
  scale?: number;
}) {
  if (figurehead.type === 'none') return null;
  const color = figurehead.color;
  const line = {
    fill: 'none',
    stroke: color,
    strokeWidth: Math.max(2, 4 * scale),
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  let shape: React.ReactNode = null;
  switch (figurehead.type) {
    case 'siren':
      shape = (
        <g>
          <circle cx={0} cy={-14 * scale} r={6 * scale} fill={color} />
          <path d={`M ${-6 * scale} ${-6 * scale} C ${-10 * scale} ${10 * scale}, ${10 * scale} ${10 * scale}, ${6 * scale} ${-6 * scale}`} {...line} />
        </g>
      );
      break;
    case 'serpent':
      shape = (
        <path d={`M ${-10 * scale} ${12 * scale} C ${-14 * scale} ${-6 * scale}, ${12 * scale} ${-4 * scale}, ${4 * scale} ${-14 * scale}`} {...line} />
      );
      break;
    case 'raven':
      shape = (
        <g>
          <path d={`M ${-12 * scale} ${4 * scale} Q ${0} ${-14 * scale} ${12 * scale} ${4 * scale}`} {...line} />
          <path d={`M ${-12 * scale} ${4 * scale} L ${-4 * scale} ${2 * scale}`} {...line} />
        </g>
      );
      break;
    case 'sphinx':
      shape = (
        <g>
          <circle cx={0} cy={-8 * scale} r={5 * scale} fill={color} />
          <path d={`M ${-8 * scale} ${0} L ${8 * scale} ${0} L ${5 * scale} ${12 * scale} L ${-5 * scale} ${12 * scale} Z`} {...line} />
        </g>
      );
      break;
    default:
      shape = null;
  }

  return (
    <g transform={`translate(${x}, ${y}) rotate(-8)`}>{shape}</g>
  );
}
