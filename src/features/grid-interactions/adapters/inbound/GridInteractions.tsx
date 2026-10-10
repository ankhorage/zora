import React from 'react';
import { View } from 'react-native';

import type {
  GridInteractionsController,
  GridInteractionsProps,
} from '../../../../types/grid-interactions';
import { createGridInteractionsController } from '../../application/createGridInteractionsController';
import { createGridInteractionsPointerQueue } from './createGridInteractionsPointerQueue';
import { GridInteractionsKeyboardProxy } from './GridInteractionsKeyboardProxy';
import { resolveGridInteractionPointer } from './resolveGridInteractionPointer';

/*** Adapts native responder and keyboard events to the controlled grid interaction boundary. */
export function GridInteractions({
  children,
  interactionPolicy,
  resizeHandle,
  testID,
  ...props
}: GridInteractionsProps) {
  const controllerProps = React.useMemo(
    () => ({ ...props, interactionPolicy }),
    [interactionPolicy, props],
  );
  const [controller] = React.useState<GridInteractionsController>(() =>
    createGridInteractionsController(controllerProps),
  );
  const surfaceRef = React.useRef<View>(null);
  const [pointerQueue] = React.useState(() => createGridInteractionsPointerQueue());
  React.useLayoutEffect(() => controller.update(controllerProps), [controller, controllerProps]);
  React.useLayoutEffect(
    () => {
      pointerQueue.activate();
      return () => {
        pointerQueue.dispose();
        controller.cancel();
      };
    },
    [controller, pointerQueue],
  );
  const withPointer = (
    event: Parameters<typeof resolveGridInteractionPointer>[0],
    handlePointer: (pointer: ReturnType<typeof resolveGridInteractionPointer>) => void,
  ) => {
    const surface = surfaceRef.current;
    if (!surface) return;
    const eventSnapshot = { nativeEvent: { ...event.nativeEvent } };
    pointerQueue.enqueue(surface, (origin) =>
      handlePointer(resolveGridInteractionPointer(eventSnapshot, origin)),
    );
  };
  const enabled = interactionPolicy !== 'passive';

  return (
    <View
      accessible
      accessibilityLabel="Grid interaction surface"
      accessibilityRole="adjustable"
      ref={surfaceRef}
      testID={testID}
      onResponderGrant={(event) =>
        withPointer(event, (pointer) => controller.begin(pointer, resizeHandle))
      }
      onResponderMove={(event) => withPointer(event, controller.move)}
      onResponderRelease={(event) => withPointer(event, controller.end)}
      onResponderTerminate={() => {
        pointerQueue.cancel();
        controller.cancel();
      }}
      onStartShouldSetResponder={() => enabled}
    >
      <GridInteractionsKeyboardProxy
        enabled={enabled}
        onKeyDown={(key, keyPointer) => {
          return controller.keyDown(key, keyPointer);
        }}
      >
        {children}
      </GridInteractionsKeyboardProxy>
    </View>
  );
}
