import type { GameEvent, GameRecord } from '@ankhorage/game';

import type { GameMeasurementBounds } from '../../../../types/gameRuntime';

/*** Create one raw geometry event without deciding collision semantics. */
export function createGameMeasurementEvent(input: CreateGameMeasurementEventInput): GameEvent {
  return {
    type: input.eventType,
    entityId: input.entityId ?? input.sourceId,
    payload: {
      sourceId: input.sourceId,
      targetId: input.targetId,
      source: toGameMeasurementRecord(input.source),
      target: toGameMeasurementRecord(input.target),
    },
  };
}

interface CreateGameMeasurementEventInput {
  readonly eventType: string;
  readonly entityId?: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly source: GameMeasurementBounds;
  readonly target: GameMeasurementBounds;
}

/*** Convert measured geometry into a serializable Game record. */
function toGameMeasurementRecord(bounds: GameMeasurementBounds): GameRecord {
  return {
    left: bounds.left,
    right: bounds.right,
    top: bounds.top,
    bottom: bounds.bottom,
    width: bounds.width,
    height: bounds.height,
  };
}
