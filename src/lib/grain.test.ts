import {
  WOOD_GRAIN,
  grainLinePath,
  grainLineReach,
  grainLineShifts,
  grainShapeIsInterior,
  type GrainLine,
  type GrainTile,
} from './grain';
import { woods } from '../data/parts';

import type { GrainLineKind } from './grain';

const numbersIn = (d: string): number[] => d.match(/-?\d+(\.\d+)?/g)!.map(Number);

/** A wave strand, as opposed to a broken-grain dash or an interior knot. */
type Strand = Extract<GrainLine, { kind: 'vertical' | 'horizontal' }>;

const strandsOf = (tile: GrainTile, kind: GrainLineKind): Strand[] =>
  tile.lines.filter((l): l is Strand => l.kind === kind);

/**
 * A strand's emitted path read back as geometry: its endpoints and the control
 * points that set its tangent at each end, expressed as (cross-axis, along)
 * where `cross` is the axis the strand waves across. Parsing the real `d`
 * string keeps these tests honest about what is actually drawn.
 */
function strandEnds(line: Strand, tile: GrainTile) {
  // `M x y Q cx cy x y Q cx cy x y`
  const n = numbersIn(grainLinePath(line, tile, 0));
  expect(n.length, `${line.kind}@${line.at}`).toBe(10);
  const vertical = line.kind === 'vertical';
  const [c, a] = vertical ? ([0, 1] as const) : ([1, 0] as const);
  return {
    startCross: n[c]!,
    startAlong: n[a]!,
    ctrl1Cross: n[2 + c]!,
    ctrl1Along: n[2 + a]!,
    endCross: n[8 + c]!,
    endAlong: n[8 + a]!,
    ctrl2Cross: n[6 + c]!,
    ctrl2Along: n[6 + a]!,
  };
}

describe('wood grain tiles', () => {
  it('defines a tile for every selectable wood type', () => {
    for (const wood of woods) {
      expect(WOOD_GRAIN[wood.id]).toBeDefined();
    }
  });

  it('has a positive, finite tile size', () => {
    for (const [id, tile] of Object.entries(WOOD_GRAIN)) {
      expect(tile.width, id).toBeGreaterThan(0);
      expect(tile.height, id).toBeGreaterThan(0);
      expect(Number.isFinite(tile.width) && Number.isFinite(tile.height), id).toBe(true);
    }
  });

  it('has at least one grain mark in every tile', () => {
    for (const [id, tile] of Object.entries(WOOD_GRAIN)) {
      expect(tile.lines.length, id).toBeGreaterThan(0);
    }
  });

  describe('tiling without a visible seam (issue #24)', () => {
    it('ends wave strands on the seam exactly where they begin', () => {
      for (const [id, tile] of Object.entries(WOOD_GRAIN)) {
        for (const kind of ['vertical', 'horizontal'] as const) {
          const span = kind === 'vertical' ? tile.height : tile.width;
          for (const line of strandsOf(tile, kind)) {
            const e = strandEnds(line, tile);
            // A strand ending at a different cross-axis offset than it starts
            // prints a step at every tile edge: the texture reset from #24.
            const where = `${id} ${kind}@${line.at}`;
            expect(e.endCross, `${where} cross-axis jump`).toBeCloseTo(e.startCross, 9);
            expect(e.endAlong, `${where} must span the tile`).toBeCloseTo(e.startAlong + span, 9);
          }
        }
      }
    });

    it('bends wave strands through the seam with a matching tangent', () => {
      for (const [id, tile] of Object.entries(WOOD_GRAIN)) {
        for (const kind of ['vertical', 'horizontal'] as const) {
          for (const line of strandsOf(tile, kind)) {
            const e = strandEnds(line, tile);
            // Slope (cross per along) leaving the near edge of the seam...
            const leaving = (e.ctrl1Cross - e.startCross) / (e.ctrl1Along - e.startAlong);
            // ...and arriving at the far edge, which is the same point on the seam.
            const arriving = (e.endCross - e.ctrl2Cross) / (e.endAlong - e.ctrl2Along);
            expect(arriving, `${id} ${kind}@${line.at} tangent kink`).toBeCloseTo(leaving, 9);
          }
        }
      }
    });

    it('keeps strand spacing even across the tile edge', () => {
      for (const [id, tile] of Object.entries(WOOD_GRAIN)) {
        for (const kind of ['vertical', 'horizontal'] as const) {
          const at = strandsOf(tile, kind)
            .map((l) => l.at)
            .sort((a, b) => a - b);
          if (at.length < 2) continue;
          const span = kind === 'vertical' ? tile.width : tile.height;
          const gaps = [...at.slice(1).map((v, i) => v - at[i]!), at[0]! + span - at[at.length - 1]!];
          const spread = Math.max(...gaps) - Math.min(...gaps);
          // An uneven wrap gap is exactly the "texture reset" the issue reports.
          expect(spread / span, `${id} ${kind}`).toBeLessThan(0.15);
        }
      }
    });

    it('keeps broken-grain segments strictly inside the tile', () => {
      for (const [id, tile] of Object.entries(WOOD_GRAIN)) {
        for (const line of tile.lines) {
          if (line.kind !== 'dash') continue;
          for (const [from, to] of line.segments) {
            expect(from, `${id} dash`).toBeGreaterThan(0);
            expect(to, `${id} dash`).toBeLessThan(tile.height);
            expect(to).toBeGreaterThan(from);
          }
        }
      }
    });

    it('keeps knots fully inside the tile so they cannot be cut by the edge', () => {
      for (const [id, tile] of Object.entries(WOOD_GRAIN)) {
        for (const line of tile.lines) {
          if (line.kind !== 'shape') continue;
          expect(grainShapeIsInterior(line, tile), `${id} knot`).toBe(true);
        }
      }
    });

    it('wraps any strand that overflows an edge so the tile clips cleanly', () => {
      for (const [id, tile] of Object.entries(WOOD_GRAIN)) {
        for (const line of tile.lines) {
          if (line.kind === 'shape') continue;
          const span = line.kind === 'horizontal' ? tile.height : tile.width;
          const reach = grainLineReach(line);
          const shifts = grainLineShifts(line, tile);
          if (line.at - reach < 0) expect(shifts, `${id} ${line.kind}@${line.at}`).toContain(span);
          if (line.at + reach > span) expect(shifts, `${id} ${line.kind}@${line.at}`).toContain(-span);
        }
      }
    });

    it('offsets a shifted strand by exactly one tile in the cross axis', () => {
      // The wrap copies are what let a strand straddle an edge; they must land
      // one full tile away, in the cross axis only.
      for (const [id, tile] of Object.entries(WOOD_GRAIN)) {
        for (const line of tile.lines) {
          if (line.kind === 'shape' || line.kind === 'dash') continue;
          const span = line.kind === 'vertical' ? tile.width : tile.height;
          const crossIndex = line.kind === 'vertical' ? 0 : 1;
          const base = numbersIn(grainLinePath(line, tile, 0));
          const moved = numbersIn(grainLinePath(line, tile, span));
          for (let i = 0; i < base.length; i++) {
            const isCross = i % 2 === crossIndex;
            const delta = moved[i]! - base[i]!;
            expect(delta, `${id} ${line.kind}@${line.at} coord ${i}`).toBeCloseTo(isCross ? span : 0, 9);
          }
        }
      }
    });
  });
});
