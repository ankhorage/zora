import { describe, expect, test } from 'bun:test';

import type { GameMeasurementBounds } from '../../../types/gameRuntime';
import { createGameMeasurementRegistry } from './createGameMeasurementRegistry';

const bounds: GameMeasurementBounds = {
  left: 10,
  right: 30,
  top: 20,
  bottom: 50,
  width: 20,
  height: 30,
};

describe('createGameMeasurementRegistry', () => {
  test('registers, reads, and unregisters one local measurement source', async () => {
    const registry = createGameMeasurementRegistry();
    const unregister = registry.registerMeasurement('player', () => Promise.resolve(bounds));

    expect(await registry.measure('player')).toEqual(bounds);
    unregister();
    expect(await registry.measure('player')).toBeUndefined();
  });

  test('does not let an older cleanup delete a newer registration with the same id', async () => {
    const registry = createGameMeasurementRegistry();
    const firstCleanup = registry.registerMeasurement('actor', () => Promise.resolve(bounds));
    const newerBounds = { ...bounds, left: 40, right: 60 };
    registry.registerMeasurement('actor', () => Promise.resolve(newerBounds));

    firstCleanup();

    expect(await registry.measure('actor')).toEqual(newerBounds);
  });
});
