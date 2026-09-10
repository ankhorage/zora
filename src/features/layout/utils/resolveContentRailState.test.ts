import { describe, expect, test } from 'bun:test';

import { resolveContentRailState } from './resolveContentRailState';

describe('resolveContentRailState', () => {
  test('resolves overflow, visible items, and the nearest navigation anchor', () => {
    expect(
      resolveContentRailState({
        contentWidth: 848,
        gap: 16,
        itemCount: 4,
        itemWidth: 200,
        logicalOffset: 216,
        viewportWidth: 432,
      }),
    ).toEqual({
      anchorIndex: 1,
      canGoNext: true,
      canGoPrevious: true,
      firstVisibleIndex: 1,
      lastVisibleIndex: 2,
      maxOffset: 416,
      offset: 216,
      stride: 216,
    });
  });

  test('clamps boundaries without wrapping', () => {
    const start = resolveContentRailState({
      contentWidth: 848,
      gap: 16,
      itemCount: 4,
      itemWidth: 200,
      logicalOffset: -100,
      viewportWidth: 432,
    });
    const end = resolveContentRailState({
      contentWidth: 848,
      gap: 16,
      itemCount: 4,
      itemWidth: 200,
      logicalOffset: 1000,
      viewportWidth: 432,
    });

    expect(start).toMatchObject({ offset: 0, canGoPrevious: false, canGoNext: true });
    expect(end).toMatchObject({ offset: 416, canGoPrevious: true, canGoNext: false });
  });

  test('degrades to a non-overflowing empty range', () => {
    expect(
      resolveContentRailState({
        contentWidth: 0,
        gap: 16,
        itemCount: 0,
        itemWidth: 0,
        logicalOffset: 0,
        viewportWidth: 432,
      }),
    ).toMatchObject({
      canGoNext: false,
      canGoPrevious: false,
      firstVisibleIndex: -1,
      lastVisibleIndex: -1,
      maxOffset: 0,
    });
  });
});
