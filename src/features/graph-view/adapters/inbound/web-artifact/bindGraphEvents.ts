import type { Core, EventObject } from 'cytoscape';

import type {
  GraphViewCallbacks,
  GraphViewController,
  GraphViewElementEventType,
} from './GraphView';

/*** Bind stable Cytoscape events that always read the latest React callbacks. */
export function bindGraphEvents(
  cy: Core,
  callbacksRef: { current: GraphViewCallbacks },
  controller: GraphViewController,
  onRuntimeChange: () => void
) {
  const nodeHandlers = bindElementEvents(cy, 'node', callbacksRef, onRuntimeChange);
  const edgeHandlers = bindElementEvents(cy, 'edge', callbacksRef, onRuntimeChange);
  const viewportHandler = () => {
    callbacksRef.current.onViewportChange?.(controller.getViewport());
    onRuntimeChange();
  };
  cy.on('zoom pan', viewportHandler);

  return () => {
    unbindElementEvents(cy, 'node', nodeHandlers);
    unbindElementEvents(cy, 'edge', edgeHandlers);
    cy.off('zoom pan', viewportHandler);
  };
}

type ElementSelector = 'edge' | 'node';

interface BoundElementHandler {
  readonly cytoscapeEvent: string;
  readonly handler: (event: EventObject) => void;
}

/*** Bind one selector's translated event set without resubscribing on callback changes. */
function bindElementEvents(
  cy: Core,
  selector: ElementSelector,
  callbacksRef: { current: GraphViewCallbacks },
  onRuntimeChange: () => void
): readonly BoundElementHandler[] {
  const callbackKey = selector === 'node' ? 'onNodeEvent' : 'onEdgeEvent';

  return EVENT_TYPES.map(([cytoscapeEvent, type]) => {
    const handler = (event: EventObject) => {
      callbacksRef.current[callbackKey]?.({
        id: String(event.target.id()),
        type,
      });
      onRuntimeChange();
    };
    cy.on(cytoscapeEvent, selector, handler);
    return { cytoscapeEvent, handler };
  });
}

/*** Remove one selector's event handlers using the exact bound callback identities. */
function unbindElementEvents(
  cy: Core,
  selector: ElementSelector,
  handlers: readonly BoundElementHandler[]
) {
  for (const { cytoscapeEvent, handler } of handlers) {
    cy.off(cytoscapeEvent, selector, handler);
  }
}

const EVENT_TYPES = [
  ['tap', 'press'],
  ['dbltap', 'double-press'],
  ['select', 'select'],
  ['unselect', 'unselect'],
  ['mouseover', 'pointer-enter'],
  ['mouseout', 'pointer-leave'],
] as const satisfies readonly (readonly [string, GraphViewElementEventType])[];
