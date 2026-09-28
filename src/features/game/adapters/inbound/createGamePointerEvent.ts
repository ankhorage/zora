import type { GameEvent } from '@ankhorage/game';

import { clampGamePercentage } from '../../utils/clampGamePercentage';

interface GamePointerEventInput {
  readonly eventType: string;
  readonly entityId?: string;
  readonly localX: number;
  readonly localY: number;
  readonly measuredWidth: number;
  readonly measuredHeight: number;
  readonly zoneX: number;
  readonly zoneY: number;
  readonly zoneWidth: number;
  readonly zoneHeight: number;
}

/*** Normalize one measured pointer/touch position into a field-relative generic Game event. */
export function createGamePointerEvent(input: GamePointerEventInput): GameEvent | undefined {
  if (
    !Number.isFinite(input.measuredWidth) ||
    !Number.isFinite(input.measuredHeight) ||
    input.measuredWidth <= 0 ||
    input.measuredHeight <= 0
  ) {
    return undefined;
  }

  const localX = clampGamePercentage((input.localX / input.measuredWidth) * 100);
  const localY = clampGamePercentage((input.localY / input.measuredHeight) * 100);
  const x = clampGamePercentage(input.zoneX + (localX * input.zoneWidth) / 100);
  const y = clampGamePercentage(input.zoneY + (localY * input.zoneHeight) / 100);

  return {
    type: input.eventType,
    ...(input.entityId === undefined ? {} : { entityId: input.entityId }),
    payload: { x, y },
  };
}
