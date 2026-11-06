import { expect, test } from 'bun:test';

import { GRAPH_VIEW_EVENTS } from '../../../constants/events';
import { createGraphViewDomCallbacks } from './createGraphViewDomCallbacks';

test('exposes public controller on bubbling ready and layout events without changing React callbacks', () => {
  const host = new EventTarget();
  const controller = createController();
  const observed: string[] = [];
  const browserEvents: string[] = [];
  for (const name of [GRAPH_VIEW_EVENTS.ready, GRAPH_VIEW_EVENTS.layoutComplete]) {
    host.addEventListener(name, (event) => {
      if (!(event instanceof CustomEvent)) throw new Error('Expected a CustomEvent.');
      const detail: unknown = event.detail;
      if (typeof detail !== 'object' || detail === null || !('controller' in detail))
        throw new Error('Expected a public controller in the browser event.');
      expect(detail.controller).toBe(controller);
      expect(event.bubbles).toBe(true);
      browserEvents.push(name);
    });
  }

  const callbacks = createGraphViewDomCallbacks(
    {
      onReady: (received) => {
        expect(received).toBe(controller);
        observed.push('ready');
      },
      onLayoutComplete: (received) => {
        expect(received).toBe(controller);
        observed.push('layout');
      },
    },
    { current: host },
  );
  callbacks.onReady?.(controller);
  callbacks.onLayoutComplete?.(controller);

  expect(observed).toEqual(['ready', 'layout']);
  expect(browserEvents).toEqual([GRAPH_VIEW_EVENTS.ready, GRAPH_VIEW_EVENTS.layoutComplete]);
  expect(controller.measureNodes(['src']).nodes[0]?.id).toBe('src');
});

test('preserves React callbacks when the browser host is unmounted', () => {
  const controller = createController();
  const observed: string[] = [];
  const callbacks = createGraphViewDomCallbacks(
    {
      onReady: () => observed.push('ready'),
      onLayoutComplete: () => observed.push('layout'),
    },
    { current: null },
  );
  callbacks.onReady?.(controller);
  callbacks.onLayoutComplete?.(controller);
  expect(observed).toEqual(['ready', 'layout']);
});

/*** Supplies public viewport and rendered geometry without a Cytoscape instance. */
function createController() {
  return {
    fit: () => undefined,
    measureNodes: (ids: readonly string[]) => ({
      nodes: ids.map((id) => ({
        id,
        position: { x: 120, y: 80 },
        size: { width: 100, height: 48 },
      })),
      viewport: { width: 800, height: 600 },
    }),
    getViewport: () => ({ pan: { x: 0, y: 0 }, zoom: 1 }),
    getZoomRange: () => ({ min: 0.5, max: 2 }),
    setPan: () => undefined,
    setZoom: () => undefined,
    zoomBy: () => undefined,
  };
}
