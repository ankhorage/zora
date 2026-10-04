import React from 'react';

import type { GameMeasurementProbeProps } from '../../../../types/gamePresentation';
import type { GameRuntimeContextValue } from '../../../../types/gameRuntime';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { GameRuntimeContext } from '../../composition/GameRuntimeContext';
import { createGameMeasurementEvent } from './createGameMeasurementEvent';

/*** Measure two registered game entities and dispatch only their raw rendered geometry. */
export const GameMeasurementProbe = withZoraThemeScope(GameMeasurementProbeInner);

/*** Measure geometry inside the inherited ZORA theme scope. */
function GameMeasurementProbeInner({
  sourceId,
  targetId,
  eventType = 'game.measurement',
  entityId,
  delayMs = 0,
  enabled = true,
  interactionPolicy,
}: GameMeasurementProbeProps) {
  const runtime = React.useContext(GameRuntimeContext);
  if (runtime === null) throw new Error('GameMeasurementProbe must be rendered inside Game.');

  React.useEffect(() => {
    if (!enabled || interactionPolicy === 'passive' || runtime.interactionPolicy === 'passive')
      return undefined;

    const timer = setTimeout(
      () => {
        void dispatchGameMeasurement({
          dispatch: runtime.dispatch,
          measure: runtime.measure,
          sourceId,
          targetId,
          eventType,
          ...(entityId === undefined ? {} : { entityId }),
        });
      },
      Math.max(0, delayMs),
    );

    return () => clearTimeout(timer);
  }, [
    delayMs,
    enabled,
    interactionPolicy,
    entityId,
    eventType,
    runtime.dispatch,
    runtime.interactionPolicy,
    runtime.measure,
    sourceId,
    targetId,
  ]);

  return null;
}

interface DispatchGameMeasurementInput {
  readonly dispatch: GameRuntimeContextValue['dispatch'];
  readonly measure: GameRuntimeContextValue['measure'];
  readonly sourceId: string;
  readonly targetId: string;
  readonly eventType: string;
  readonly entityId?: string;
}

/*** Resolve both registered entity measurements before dispatching one Game event. */
async function dispatchGameMeasurement(input: DispatchGameMeasurementInput): Promise<void> {
  const [source, target] = await Promise.all([
    input.measure(input.sourceId),
    input.measure(input.targetId),
  ]);
  if (source === undefined || target === undefined) return;

  input.dispatch(
    createGameMeasurementEvent({
      eventType: input.eventType,
      ...(input.entityId === undefined ? {} : { entityId: input.entityId }),
      sourceId: input.sourceId,
      targetId: input.targetId,
      source,
      target,
    }),
  );
}
