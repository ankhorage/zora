import type { GameMeasurementReader, GameMeasurementRegistry } from '../../../types/gameRuntime';

/*** Create one isolated measurement registry for an embeddable Game instance. */
export function createGameMeasurementRegistry(): GameMeasurementRegistry {
  const readers = new Map<string, GameMeasurementReader>();

  return {
    registerMeasurement: (id, reader) => {
      readers.set(id, reader);
      return () => {
        if (readers.get(id) === reader) readers.delete(id);
      };
    },
    measure: (id) => readers.get(id)?.() ?? Promise.resolve(undefined),
  };
}
