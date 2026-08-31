import { describe, expect, test } from 'bun:test';

import { resolveProgressRingGeometry } from './resolveProgressRingGeometry';

describe('resolveProgressRingGeometry', () => {
  test('normalizes invalid dimensions and fractions deterministically', () => {
    expect(
      resolveProgressRingGeometry({ fraction: Number.NaN, size: Number.NaN, thickness: -1 }),
    ).toMatchObject({
      diameter: 120,
      filledSegmentCount: 0,
      strokeWidth: 10,
    });
  });

  test('clamps size, thickness, and progress to renderable bounds', () => {
    const empty = resolveProgressRingGeometry({ fraction: -1, size: 4, thickness: 30 });
    const complete = resolveProgressRingGeometry({ fraction: 2, size: 80, thickness: 8 });

    expect(empty).toMatchObject({ diameter: 24, filledSegmentCount: 0, strokeWidth: 12 });
    expect(complete.filledSegmentCount).toBe(complete.segmentCount);
  });

  test('maps determinate progress to the ring segments', () => {
    const geometry = resolveProgressRingGeometry({ fraction: 0.68, size: 120, thickness: 10 });

    expect(geometry.filledSegmentCount).toBe(Math.round(geometry.segmentCount * 0.68));
    expect(geometry.segmentWidth).toBeGreaterThan(0);
  });
});
