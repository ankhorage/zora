import type {
  GraphViewCallbacks,
  GraphViewController,
  GraphViewDomControllerEventDetail,
} from '../../../../../types/graph-view';

/***
 * Mirror public GraphView controller callbacks as bubbling browser lifecycle events.
 * Browser hosts can measure actual rendered nodes without reaching into the graph engine.
 */
export function createGraphViewDomCallbacks(
  callbacks: GraphViewCallbacks,
  hostRef: { readonly current: unknown },
): GraphViewCallbacks {
  return {
    ...callbacks,
    onReady(controller) {
      callbacks.onReady?.(controller);
      dispatchGraphViewControllerEvent(hostRef, 'zora-graph-view-ready', controller);
    },
    onLayoutComplete(controller) {
      callbacks.onLayoutComplete?.(controller);
      dispatchGraphViewControllerEvent(hostRef, 'zora-graph-view-layout-complete', controller);
    },
  };
}

/*** Deliver the existing public controller reference on the GraphView root event channel. */
function dispatchGraphViewControllerEvent(
  hostRef: { readonly current: unknown },
  name: 'zora-graph-view-ready' | 'zora-graph-view-layout-complete',
  controller: GraphViewController,
): void {
  const host = hostRef.current;
  if (
    typeof host !== 'object' ||
    host === null ||
    !('dispatchEvent' in host) ||
    typeof host.dispatchEvent !== 'function'
  ) return;
  host.dispatchEvent(
    new CustomEvent<GraphViewDomControllerEventDetail>(name, {
      bubbles: true,
      detail: { controller },
    }),
  );
}
