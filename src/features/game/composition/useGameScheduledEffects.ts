import { advanceGameTime, type GameDefinition, type GameInput } from '@ankhorage/game';
import React from 'react';

import type { GameRuntimeState } from '../../../types/gameRuntime';

type SetGameRuntime = React.Dispatch<React.SetStateAction<GameRuntimeState>>;

/*** Advance the nearest scheduled game effects through one platform timer. */
export function useGameScheduledEffects({
  clockRef,
  definitionRef,
  enabled,
  inputRef,
  runtimeKey,
  scheduled,
  setRuntime,
}: UseGameScheduledEffectsArgs): void {
  React.useEffect(() => {
    if (!enabled || scheduled.length === 0) return undefined;
    const delayMs = resolveNextScheduledDelay(scheduled);

    const timer = setTimeout(() => {
      const now = Date.now();
      const elapsedMs = Math.max(0, now - clockRef.current);
      clockRef.current = now;
      setRuntime((current) =>
        advanceScheduledRuntime({
          current,
          definition: definitionRef.current,
          elapsedMs,
          input: inputRef.current,
          runtimeKey,
        }),
      );
    }, delayMs);

    return () => clearTimeout(timer);
  }, [clockRef, definitionRef, enabled, inputRef, runtimeKey, scheduled, setRuntime]);
}

interface UseGameScheduledEffectsArgs {
  readonly clockRef: React.RefObject<number>;
  readonly definitionRef: React.RefObject<GameDefinition>;
  readonly enabled: boolean;
  readonly inputRef: React.RefObject<GameInput>;
  readonly runtimeKey: string;
  readonly scheduled: GameRuntimeState['session']['scheduled'];
  readonly setRuntime: SetGameRuntime;
}

interface AdvanceScheduledRuntimeArgs {
  readonly current: GameRuntimeState;
  readonly definition: GameDefinition;
  readonly elapsedMs: number;
  readonly input: GameInput;
  readonly runtimeKey: string;
}

/*** Advance one matching runtime state while preserving sessions that have already reset. */
function advanceScheduledRuntime({
  current,
  definition,
  elapsedMs,
  input,
  runtimeKey,
}: AdvanceScheduledRuntimeArgs): GameRuntimeState {
  if (current.key !== runtimeKey) return current;
  const result = advanceGameTime(definition, current.session, elapsedMs, input);
  return {
    key: runtimeKey,
    session: result.session,
    outputs: result.outputs,
    revision: current.revision + 1,
  };
}

/*** Resolve the nearest scheduled game consequence without owning domain timing rules. */
function resolveNextScheduledDelay(
  scheduledEffects: GameRuntimeState['session']['scheduled'],
): number {
  return scheduledEffects.reduce(
    (nearest, scheduled) => Math.min(nearest, scheduled.remainingMs),
    Number.POSITIVE_INFINITY,
  );
}
