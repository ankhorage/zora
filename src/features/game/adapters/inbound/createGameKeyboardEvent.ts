import type { GameEvent } from '@ankhorage/game';

import type { GameKeyboardBinding } from '../../../../types/gamePresentation';

interface CreateGameKeyboardEventInput {
  readonly bindings: readonly GameKeyboardBinding[];
  readonly fallbackEventType: string;
  readonly fallbackEntityId?: string;
  readonly key: string;
}

interface GameKeyboardEventResult {
  readonly event: GameEvent;
  readonly preventDefault: boolean;
}

/*** Map one configured keyboard key into a generic Game event. */
export function createGameKeyboardEvent(
  input: CreateGameKeyboardEventInput,
): GameKeyboardEventResult | undefined {
  const binding = input.bindings.find((candidate) => candidate.key === input.key);
  if (binding === undefined) return undefined;

  const entityId = binding.entityId ?? input.fallbackEntityId;
  return {
    event: {
      type: binding.eventType ?? input.fallbackEventType,
      ...(entityId === undefined ? {} : { entityId }),
      payload: { key: input.key },
    },
    preventDefault: binding.preventDefault ?? false,
  };
}
