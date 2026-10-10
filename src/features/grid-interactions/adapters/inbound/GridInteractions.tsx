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
  const pendingPointersRef = React.useRef<GridInteractionPointerWork[]>([]);
  const measuringPointerRef = React.useRef(false);
  React.useLayoutEffect(() => controller.update(controllerProps), [controller, controllerProps]);
  const withPointer = (
    event: Parameters<typeof resolveGridInteractionPointer>[0],
    handlePointer: (pointer: ReturnType<typeof resolveGridInteractionPointer>) => void,
  ) => {
    pendingPointersRef.current.push({
      event: { nativeEvent: { ...event.nativeEvent } },
      handlePointer,
    });
    processNextPointer();
  };
  const processNextPointer = () => {
    if (measuringPointerRef.current) return;
    const pointerWork = pendingPointersRef.current.shift();
    const surface = surfaceRef.current;
    if (!pointerWork || !surface) return;
    measuringPointerRef.current = true;
    measureSurfaceOrigin(surface, (origin) => {
      pointerWork.handlePointer(resolveGridInteractionPointer(pointerWork.event, origin));
      measuringPointerRef.current = false;
      processNextPointer();
    });
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

interface GridInteractionPointerWork {
  readonly event: Parameters<typeof resolveGridInteractionPointer>[0];
  readonly handlePointer: (pointer: ReturnType<typeof resolveGridInteractionPointer>) => void;
}

/*** Measures the root surface for every responder event so page coordinates cannot become stale. */
function measureSurfaceOrigin(
  surface: View,
  onOrigin: (origin: { readonly x: number; readonly y: number }) => void,
) {
  const element = surface as unknown as { readonly getBoundingClientRect?: () => DOMRect };
  const rect = element.getBoundingClientRect?.();
  if (rect) {
    onOrigin({ x: rect.left, y: rect.top });
    return;
  }
  if (typeof surface.measureInWindow === 'function') {
    surface.measureInWindow((x, y) => onOrigin({ x, y }));
    return;
  }
  onOrigin({ x: 0, y: 0 });
}
