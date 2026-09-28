import { describe, expect, test } from 'bun:test';

import { createGamePointerEvent } from './createGamePointerEvent';

describe('createGamePointerEvent', () => {
  test('maps zone-local pointer coordinates into field percentages', () => {
    expect(
      createGamePointerEvent({
        eventType: 'player.move',
        entityId: 'player',
        localX: 100,
        localY: 25,
        measuredWidth: 200,
        measuredHeight: 100,
        zoneX: 10,
        zoneY: 60,
        zoneWidth: 80,
        zoneHeight: 30,
      }),
    ).toEqual({
      type: 'player.move',
      entityId: 'player',
      payload: { x: 50, y: 67.5 },
    });
  });

  test('clamps out-of-bounds native coordinates and rejects unmeasured zones', () => {
    expect(
      createGamePointerEvent({
        eventType: 'pointer.move',
        localX: 500,
        localY: -20,
        measuredWidth: 100,
        measuredHeight: 100,
        zoneX: 20,
        zoneY: 20,
        zoneWidth: 50,
        zoneHeight: 50,
      }),
    ).toEqual({ type: 'pointer.move', payload: { x: 70, y: 20 } });

    expect(
      createGamePointerEvent({
        eventType: 'pointer.move',
        localX: 0,
        localY: 0,
        measuredWidth: 0,
        measuredHeight: 100,
        zoneX: 0,
        zoneY: 0,
        zoneWidth: 100,
        zoneHeight: 100,
      }),
    ).toBeUndefined();
  });
});
