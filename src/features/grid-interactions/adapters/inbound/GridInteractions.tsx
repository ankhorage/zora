import React from 'react';
import { View } from 'react-native';

import type {
  GridInteractionsController,
  GridInteractionsProps,
} from '../../../../types/grid-interactions';
import { createGridInteractionsController } from '../../application/createGridInteractionsController';
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
  const surfaceOriginRef = React.useRef({ x: 0, y: 0 });
  React.useLayoutEffect(() => controller.update(controllerProps), [controller, controllerProps]);
  const pointer = (event: Parameters<typeof resolveGridInteractionPointer>[0]) =>
    resolveGridInteractionPointer(event, surfaceOriginRef.current);
  const enabled = interactionPolicy !== 'passive';

  return (
    <View
      accessible
      accessibilityLabel="Grid interaction surface"
      accessibilityRole="adjustable"
      ref={surfaceRef}
      testID={testID}
      onLayout={() => {
        surfaceRef.current?.measureInWindow((x, y) => {
          surfaceOriginRef.current = { x, y };
        });
      }}
      onResponderGrant={(event) => controller.begin(pointer(event), resizeHandle)}
      onResponderMove={(event) => controller.move(pointer(event))}
      onResponderRelease={(event) => controller.end(pointer(event))}
      onResponderTerminate={() => controller.cancel()}
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
