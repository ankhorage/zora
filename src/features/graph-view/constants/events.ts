/***
 * Canonical public GraphView browser lifecycle event names.
 * Candidate for a shared Ankhorage event strategy: define common naming, typed
 * payloads and dispatch conventions before extracting a cross-component contract.
 */
export const GRAPH_VIEW_EVENTS = {
  ready: 'zora-graph-view-ready',
  layoutComplete: 'zora-graph-view-layout-complete',
} as const;

export type GraphViewDomControllerEventName =
  (typeof GRAPH_VIEW_EVENTS)[keyof typeof GRAPH_VIEW_EVENTS];
