import type { GridInteractionPointer } from '../../../../types/grid-interactions';

/*** Converts a responder event into coordinates local to the interaction surface. */
export function resolveGridInteractionPointer(
  event: GridInteractionNativePointerEvent,
  surfaceOrigin: GridInteractionSurfaceOrigin,
): GridInteractionPointer {
  const { nativeEvent } = event;
  const { pageX, pageY } = nativeEvent;
  const x =
    typeof pageX === 'number' && Number.isFinite(pageX)
      ? pageX - surfaceOrigin.x
      : nativeEvent.locationX;
  const y =
    typeof pageY === 'number' && Number.isFinite(pageY)
      ? pageY - surfaceOrigin.y
      : nativeEvent.locationY;

  return {
    altKey: nativeEvent.altKey,
    ctrlKey: nativeEvent.ctrlKey,
    metaKey: nativeEvent.metaKey,
    shiftKey: nativeEvent.shiftKey,
    x,
    y,
  };
}

interface GridInteractionNativePointerEvent {
  readonly nativeEvent: {
    readonly altKey?: boolean;
    readonly ctrlKey?: boolean;
    readonly locationX: number;
    readonly locationY: number;
    readonly metaKey?: boolean;
    readonly pageX?: number;
    readonly pageY?: number;
    readonly shiftKey?: boolean;
  };
}

interface GridInteractionSurfaceOrigin {
  readonly x: number;
  readonly y: number;
}
