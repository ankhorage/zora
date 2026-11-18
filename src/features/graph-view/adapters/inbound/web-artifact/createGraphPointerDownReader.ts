import { isRecord } from '@ankhorage/utility/object';

/*** Correlate one native pointer-down snapshot with its renderer activation without retaining stale modifiers. */
export function createGraphPointerDownReader() {
  let latestPointerDown: GraphPointerDownSnapshot | null = null;

  return {
    clear: () => {
      latestPointerDown = null;
    },
    read: (rendererEvent: unknown): unknown => {
      const pointerDown = latestPointerDown;
      latestPointerDown = null;
      if (pointerDown === null) return null;
      return matchesPointerActivation(pointerDown, rendererEvent) ? pointerDown.event : null;
    },
    write: (event: unknown) => {
      latestPointerDown = createPointerDownSnapshot(event);
    },
  };
}

/*** Match only the same browser pointer so unrelated renderer events cannot inherit modifiers. */
function matchesPointerActivation(
  pointerDown: GraphPointerDownSnapshot,
  rendererEvent: unknown,
): boolean {
  return readRendererPointerId(rendererEvent) === pointerDown.pointerId;
}

/*** Retain a browser pointer event only when it provides a stable pointer identity. */
function createPointerDownSnapshot(event: unknown): GraphPointerDownSnapshot | null {
  if (!isRecord(event) || typeof event.pointerId !== 'number') return null;
  return { event, pointerId: event.pointerId };
}

/*** Read Cytoscape's underlying browser event without trusting programmatic event shapes. */
function readRendererPointerId(value: unknown): number | null {
  if (!isRecord(value)) return null;
  const originalEvent = value.originalEvent;
  if (!isRecord(originalEvent) || typeof originalEvent.pointerId !== 'number') return null;
  return originalEvent.pointerId;
}

interface GraphPointerDownSnapshot {
  readonly event: unknown;
  readonly pointerId: number;
}
