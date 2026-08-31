import { describe, expect, test } from 'bun:test';

import { resolveContentRailPhysicalOffset } from './resolveContentRailPhysicalOffset';

describe('resolveContentRailPhysicalOffset', () => {
  test('keeps logical and physical offsets aligned for LTR content', () => {
    expect(
      resolveContentRailPhysicalOffset({ isRtl: false, logicalOffset: 216, maxOffset: 648 }),
    ).toBe(216);
  });

  test('inverts offsets for RTL while preserving logical boundaries', () => {
    expect(
      resolveContentRailPhysicalOffset({ isRtl: true, logicalOffset: 0, maxOffset: 648 }),
    ).toBe(648);
    expect(
      resolveContentRailPhysicalOffset({ isRtl: true, logicalOffset: 216, maxOffset: 648 }),
    ).toBe(432);
    expect(
      resolveContentRailPhysicalOffset({ isRtl: true, logicalOffset: 648, maxOffset: 648 }),
    ).toBe(0);
  });

  test('clamps offsets rather than wrapping', () => {
    expect(
      resolveContentRailPhysicalOffset({ isRtl: true, logicalOffset: 900, maxOffset: 648 }),
    ).toBe(0);
  });
});
