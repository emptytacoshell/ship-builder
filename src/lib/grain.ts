import type { WoodId } from '../types/build';

/**
 * Wood grain is painted as an SVG `<pattern>`, so the tile repeats. Any mark
 * whose endpoints disagree across a tile edge shows up as a visible texture
 * reset (issue #24), so tiles are built from marks that are seam-safe by
 * construction:
 *
 * - a `vertical` strand is a sine-like wave running top→bottom whose start and
 *   end share the same x *and* the same tangent, so it reads as one continuous
 *   grain line across the horizontal tile edge;
 * - a `horizontal` strand is the same idea rotated, tiling across the vertical
 *   edge;
 * - strands are spaced so the gap from the last strand to the first strand of
 *   the next tile equals every other gap;
 * - `dash` segments and `shape` marks are kept strictly inside the tile, so
 *   they never meet an edge and can't create a seam.
 *
 * SVG patterns clip to the tile, so a mark whose wave spills past an edge is
 * drawn again on the opposite edge (see `grainLineShifts`).
 */
export type GrainLine =
  | {
      kind: 'vertical';
      /** Cross-axis (x) position of the strand. */
      at: number;
      amplitude: number;
      stroke: string;
      strokeWidth: number;
      opacity: number;
    }
  | {
      kind: 'horizontal';
      /** Cross-axis (y) position of the strand. */
      at: number;
      amplitude: number;
      stroke: string;
      strokeWidth: number;
      opacity: number;
    }
  | {
      kind: 'dash';
      at: number;
      /** Broken grain segments as [startY, endY] pairs, kept inside the tile. */
      segments: ReadonlyArray<readonly [number, number]>;
      stroke: string;
      strokeWidth: number;
      opacity: number;
    }
  | {
      kind: 'shape';
      d: string;
      /** [minX, minY, maxX, maxY]; must sit inside the tile. */
      bounds: readonly [number, number, number, number];
      stroke: string;
      strokeWidth: number;
      opacity: number;
    };

export type GrainLineKind = GrainLine['kind'];

export interface GrainTile {
  width: number;
  height: number;
  lines: ReadonlyArray<GrainLine>;
}

/** How far a mark reaches from its centre line in the cross axis. */
export function grainLineReach(line: GrainLine): number {
  switch (line.kind) {
    case 'vertical':
    case 'horizontal':
      return line.amplitude + line.strokeWidth / 2;
    case 'dash':
      return line.strokeWidth / 2;
    case 'shape':
      return 0;
  }
}

const [MIN_X, MIN_Y, MAX_X, MAX_Y] = [0, 1, 2, 3] as const;

/** True when a shape sits entirely within the tile and needs no wrap copy. */
export function grainShapeIsInterior(line: Extract<GrainLine, { kind: 'shape' }>, tile: GrainTile): boolean {
  return (
    line.bounds[MIN_X] - line.strokeWidth / 2 >= 0 &&
    line.bounds[MIN_Y] - line.strokeWidth / 2 >= 0 &&
    line.bounds[MAX_X] + line.strokeWidth / 2 <= tile.width &&
    line.bounds[MAX_Y] + line.strokeWidth / 2 <= tile.height
  );
}

/**
 * Cross-axis shifts to draw a line at so it survives the tile's clipping.
 * A line that spills off one edge is repeated at the opposite edge, which is
 * what keeps the grain continuous across tiles.
 */
export function grainLineShifts(line: GrainLine, tile: GrainTile): number[] {
  if (line.kind === 'shape') return [0];
  const span = line.kind === 'horizontal' ? tile.height : tile.width;
  const reach = grainLineReach(line);
  const shifts = [0];
  if (line.at - reach < 0) shifts.push(span);
  if (line.at + reach > span) shifts.push(-span);
  return shifts;
}

/** The `d` attribute for one mark, offset in the cross axis by `shift`. */
export function grainLinePath(line: GrainLine, tile: GrainTile, shift: number): string {
  switch (line.kind) {
    case 'vertical': {
      const x = line.at + shift;
      const h = tile.height;
      const a = line.amplitude;
      // Start and end share x, and the tangent leaving the top equals the
      // tangent arriving at the bottom, so the seam is invisible.
      return `M ${x} 0 Q ${x + a} ${h / 4} ${x} ${h / 2} Q ${x - a} ${(3 * h) / 4} ${x} ${h}`;
    }
    case 'horizontal': {
      const y = line.at + shift;
      const w = tile.width;
      const a = line.amplitude;
      return `M 0 ${y} Q ${w / 4} ${y + a} ${w / 2} ${y} Q ${(3 * w) / 4} ${y - a} ${w} ${y}`;
    }
    case 'dash': {
      const x = line.at + shift;
      return line.segments.map(([from, to]) => `M ${x} ${from} L ${x} ${to}`).join(' ');
    }
    case 'shape':
      return line.d;
  }
}

const strand = (
  at: number,
  amplitude: number,
  stroke: string,
  strokeWidth: number,
  opacity: number,
): GrainLine => ({ kind: 'vertical', at, amplitude, stroke, strokeWidth, opacity });

const row = (
  at: number,
  amplitude: number,
  stroke: string,
  strokeWidth: number,
  opacity: number,
): GrainLine => ({ kind: 'horizontal', at, amplitude, stroke, strokeWidth, opacity });

const dash = (
  at: number,
  segments: ReadonlyArray<readonly [number, number]>,
  stroke: string,
  strokeWidth: number,
  opacity: number,
): GrainLine => ({ kind: 'dash', at, segments, stroke, strokeWidth, opacity });

const knot = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  stroke: string,
  strokeWidth: number,
  opacity: number,
): GrainLine => ({
  kind: 'shape',
  // Ellipse from two arcs; centre (cx, cy), radii (rx, ry).
  d: `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`,
  bounds: [cx - rx, cy - ry, cx + rx, cy + ry],
  stroke,
  strokeWidth,
  opacity,
});

/**
 * One tile per wood type. Every type is covered, so `wood-grain-${wood}`
 * always resolves.
 */
export const WOOD_GRAIN: Record<WoodId, GrainTile> = {
  // Oak: straight grain with a gentle wave, plus faint horizontal rays.
  oak: {
    width: 24,
    height: 48,
    lines: [
      strand(0, 2.5, '#2a1508', 1.5, 0.3),
      strand(6, 2, '#2a1508', 1, 0.2),
      strand(12, 2.5, '#1a0f05', 1.2, 0.25),
      strand(18, 2, '#2a1508', 1.1, 0.22),
      row(10, 2, '#1a0f05', 0.8, 0.12),
      row(34, 2, '#1a0f05', 0.8, 0.1),
    ],
  },
  // Walnut: rich cathedral grain, laid down as horizontal bands.
  walnut: {
    width: 30,
    height: 50,
    lines: [
      row(0, 3, '#1a0f08', 2, 0.3),
      row(10, 2.5, '#1a0f08', 1.5, 0.2),
      row(20, 3, '#2a1810', 1, 0.25),
      row(30, 2.5, '#1a0f08', 2, 0.3),
      row(40, 3, '#1a0f08', 1.5, 0.2),
    ],
  },
  // Ironwood: very dense, tight parallel lines.
  ironwood: {
    width: 12,
    height: 30,
    lines: [
      strand(0, 0, '#0a0604', 1.2, 0.35),
      strand(3, 0, '#0a0604', 0.8, 0.25),
      strand(6, 0, '#0a0604', 1.4, 0.3),
      strand(9, 0, '#0a0604', 0.7, 0.2),
    ],
  },
  // Driftwood: weathered, broken grain with a knot.
  driftwood: {
    width: 24,
    height: 36,
    lines: [
      dash(0, [[3, 11], [17, 25]], '#7a8a8a', 1.5, 0.35),
      dash(8, [[5, 13], [21, 31]], '#6a7a7a', 1, 0.3),
      dash(16, [[3, 9], [15, 23], [28, 33]], '#7a8a8a', 1.2, 0.25),
      knot(7, 30, 3, 4, '#5a6a6a', 0.8, 0.3),
    ],
  },
  // Teak: fine, straight golden grain.
  teak: {
    width: 16,
    height: 40,
    lines: [
      strand(0, 1, '#5a3a10', 1, 0.3),
      strand(8, 1, '#6a4a18', 0.7, 0.2),
    ],
  },
  // Ebony: very subtle, dark fine grain.
  ebony: {
    width: 14,
    height: 35,
    lines: [
      strand(0, 1, '#050302', 1, 0.45),
      strand(7, 1, '#050302', 0.8, 0.35),
    ],
  },
};
