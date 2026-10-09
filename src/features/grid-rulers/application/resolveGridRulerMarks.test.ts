import { type GridViewport, snapWorldCoordinate } from '@ankhorage/grid-view';
import { describe, expect, test } from 'bun:test';

import { resolveGridRulerMarks } from './resolveGridRulerMarks';

const viewport: GridViewport = {
  width: 300,
  height: 160,
  offsetX: 40,
  offsetY: 20,
  pixelsPerUnitX: 2,
  pixelsPerUnitY: 4,
};

describe('resolveGridRulerMarks', () => {
  test('aligns independent axis scales and scroll offsets through the published viewport transform', () => {
    expect(
      resolveGridRulerMarks(viewport, 'x', {
        kind: 'ticks',
        specification: { mode: 'fixed', step: 20 },
      }).map((mark) => mark.position),
    ).toEqual([0, 40, 80, 120, 160, 200, 240, 280]);
    expect(
      resolveGridRulerMarks(viewport, 'y', {
        kind: 'ticks',
        specification: { mode: 'fixed', step: 10 },
      }).map((mark) => mark.position),
    ).toEqual([0, 40, 80, 120, 160]);
  });

  test('projects only visible variable-width category starts', () => {
    expect(
      resolveGridRulerMarks(viewport, 'x', {
        kind: 'categories',
        categories: [
          { id: 'before', size: 10, start: 20 },
          { id: 'visible-a', size: 37, start: 40 },
          { id: 'visible-b', size: 91, start: 77 },
        ],
      }),
    ).toEqual([
      { categoryId: 'visible-a', level: 'major', position: 0 },
      { categoryId: 'visible-b', level: 'major', position: 74 },
    ]);
  });

  test('keeps a fixed interaction snap unchanged when display density changes', () => {
    const snap = { mode: 'fixed' as const, step: 25 };
    const sparse = resolveGridRulerMarks(viewport, 'x', {
      kind: 'ticks',
      specification: { mode: 'fixed', step: 50 },
    });
    const dense = resolveGridRulerMarks(viewport, 'x', {
      kind: 'ticks',
      specification: { mode: 'fixed', step: 5 },
    });

    expect(dense.length).toBeGreaterThan(sparse.length);
    expect(snapWorldCoordinate(62, snap)).toBe(50);
  });

  test('accepts externally supplied labels without introducing domain adapters', () => {
    expect(
      resolveGridRulerMarks(
        viewport,
        'x',
        { kind: 'ticks', specification: { mode: 'fixed', step: 20 } },
        (tick) => `bar ${tick.position}`,
      )[0],
    ).toEqual({ label: 'bar 40', level: 'major', position: 0 });
  });

  test('projects horizontal marks consistently in RTL and evaluates each formatter once', () => {
    let formatterCalls = 0;

    const marks = resolveGridRulerMarks(
      viewport,
      'x',
      { kind: 'ticks', specification: { mode: 'fixed', step: 20 } },
      (tick) => {
        formatterCalls += 1;
        return `tick ${tick.position}`;
      },
      'rtl',
    );

    expect(marks.map((mark) => mark.position)).toEqual([300, 260, 220, 180, 140, 100, 60, 20]);
    expect(formatterCalls).toBe(marks.length);
  });
});
