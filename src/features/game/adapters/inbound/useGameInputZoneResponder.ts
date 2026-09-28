import React from 'react';
import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native';

import type { GameInputZoneProps } from '../../../../types/gamePresentation';
import { GameRuntimeContext } from '../../composition/GameRuntimeContext';
import { createGameKeyboardEvent } from './createGameKeyboardEvent';
import { createGamePointerEvent } from './createGamePointerEvent';

interface GameKeyboardInputEvent {
  readonly key: string;
  preventDefault(): void;
}

interface MeasuredSize {
  readonly width: number;
  readonly height: number;
}

/*** Own React Native responder measurement and event dispatch for one Game input zone. */
export function useGameInputZoneResponder(props: GameInputZoneProps) {
  const runtime = React.useContext(GameRuntimeContext);
  if (runtime === null) throw new Error('GameInputZone must be rendered inside Game.');

  const measuredSizeRef = React.useRef<MeasuredSize>({ width: 0, height: 0 });
  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    measuredSizeRef.current = { width, height };
  }, []);

  const dispatchPointer = React.useCallback(
    (event: GestureResponderEvent) => {
      if (runtime.interactionPolicy === 'passive' || props.interactionPolicy === 'passive') return;
      const measured = measuredSizeRef.current;
      const gameEvent = createGamePointerEvent({
        eventType: props.eventType,
        ...(props.entityId === undefined ? {} : { entityId: props.entityId }),
        localX: event.nativeEvent.locationX,
        localY: event.nativeEvent.locationY,
        measuredWidth: measured.width,
        measuredHeight: measured.height,
        zoneX: props.x ?? 0,
        zoneY: props.y ?? 0,
        zoneWidth: props.width ?? 100,
        zoneHeight: props.height ?? 100,
      });
      if (gameEvent !== undefined) runtime.dispatch(gameEvent);
    },
    [
      props.entityId,
      props.eventType,
      props.height,
      props.interactionPolicy,
      props.width,
      props.x,
      props.y,
      runtime,
    ],
  );

  const dispatchKeyboard = React.useCallback(
    (event: GameKeyboardInputEvent) => {
      if (runtime.interactionPolicy === 'passive' || props.interactionPolicy === 'passive') return;
      const result = createGameKeyboardEvent({
        bindings: props.keyboardBindings ?? [],
        fallbackEventType: props.eventType,
        ...(props.entityId === undefined ? {} : { fallbackEntityId: props.entityId }),
        key: event.key,
      });
      if (result === undefined) return;
      if (result.preventDefault) event.preventDefault();
      runtime.dispatch(result.event);
    },
    [props.entityId, props.eventType, props.interactionPolicy, props.keyboardBindings, runtime],
  );

  return {
    dispatchKeyboard,
    dispatchPointer,
    handleLayout,
    shouldSetResponder: () =>
      (props.enabled ?? true) &&
      props.interactionPolicy !== 'passive' &&
      runtime.interactionPolicy !== 'passive',
  };
}
