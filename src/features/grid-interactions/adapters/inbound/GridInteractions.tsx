import React from 'react';
import { View } from 'react-native';

import type {
  GridInteractionPointer,
  GridInteractionsProps,
} from '../../../../types/grid-interactions';
import { createGridInteractionsController } from '../../application/createGridInteractionsController';
import { GridInteractionsKeyboardProxy } from './GridInteractionsKeyboardProxy';

/*** Adapts native responder and keyboard events to the controlled grid interaction boundary. */
export function GridInteractions({
  children,
  interactionPolicy,
  testID,
  ...props
}: GridInteractionsProps) {
  const controller = React.useMemo(() => createGridInteractionsController(props), [props]);
  const pointer = (event: {
    readonly nativeEvent: NativePointerEvent;
  }): GridInteractionPointer => ({
    altKey: event.nativeEvent.altKey,
    ctrlKey: event.nativeEvent.ctrlKey,
    metaKey: event.nativeEvent.metaKey,
    shiftKey: event.nativeEvent.shiftKey,
    x: event.nativeEvent.locationX,
    y: event.nativeEvent.locationY,
  });
  const enabled = interactionPolicy !== 'passive';

  return (
    <View
      accessible
      accessibilityLabel="Grid interaction surface"
      accessibilityRole="adjustable"
      testID={testID}
      onResponderGrant={(event) => controller.begin(pointer(event))}
      onResponderMove={(event) => controller.move(pointer(event))}
      onResponderRelease={(event) => controller.end(pointer(event))}
      onResponderTerminate={() => controller.cancel()}
      onStartShouldSetResponder={() => enabled}
    >
      <GridInteractionsKeyboardProxy
        onKeyDown={(key) => {
          return controller.keyDown(key);
        }}
      >
        {children}
      </GridInteractionsKeyboardProxy>
    </View>
  );
}

interface NativePointerEvent {
  readonly altKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly locationX: number;
  readonly locationY: number;
  readonly metaKey?: boolean;
  readonly shiftKey?: boolean;
}
