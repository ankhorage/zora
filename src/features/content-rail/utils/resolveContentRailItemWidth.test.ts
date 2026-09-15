import { describe, expect, test } from 'bun:test';

import { resolveContentRailItemWidth } from './resolveContentRailItemWidth';

describe('resolveContentRailItemWidth', () => {
  test('keeps fixed item sizes within the available viewport', () => {
    expect(
      resolveContentRailItemWidth({
        gap: 16,
        itemCount: 4,
        itemSize: 'regular',
        padding: 16,
        peek: 32,
        viewportWidth: 500,
      }),
    ).toBe(200);
    expect(
      resolveContentRailItemWidth({
        gap: 16,
        itemCount: 4,
        itemSize: 'wide',
        padding: 16,
        peek: 32,
        viewportWidth: 240,
      }),
    ).toBe(208);
  });

  test('reserves a deterministic partial-next affordance at responsive breakpoints', () => {
    expect(
      resolveContentRailItemWidth({
        gap: 16,
        itemCount: 5,
        itemSize: 'responsive',
        padding: 16,
        peek: 32,
        viewportWidth: 500,
      }),
    ).toBe(202);
    expect(
      resolveContentRailItemWidth({
        gap: 16,
        itemCount: 5,
        itemSize: 'responsive',
        padding: 16,
        peek: 32,
        viewportWidth: 800,
      }),
    ).toBe(229);
  });

  test('removes the peek and distributes items predictably when content fits', () => {
    expect(
      resolveContentRailItemWidth({
        gap: 16,
        itemCount: 2,
        itemSize: 'responsive',
        padding: 16,
        peek: 32,
        viewportWidth: 800,
      }),
    ).toBe(280);
  });

  test('handles empty and unmeasured rails', () => {
    expect(
      resolveContentRailItemWidth({
        gap: 16,
        itemCount: 0,
        itemSize: 'responsive',
        padding: 16,
        peek: 32,
        viewportWidth: 500,
      }),
    ).toBe(0);
  });
});
