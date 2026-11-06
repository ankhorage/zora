import { expect, test } from 'bun:test';

import type {
  GraphViewController,
  GraphViewDomControllerEventDetail,
} from '../../../../../types/graph-view';
import { createGraphViewDomCallbacks } from './createGraphViewDomCallbacks';

test(
  'exposes actual public controller on bubbling ready and layout events without changing React callbacks',
  () => {
    const host = new EventTarget();
    const controller = createController();
    const observed: string[] = [];
    const browserEvents: string[] = [];
    for (const name of ['zora-graph-view-ready', 'zora-graph-view-layout-complete']) {
      host.addEventListener(name, event => {
        if (!(event instanceof CustomEvent)) throw new Error('Expected a CustomEvent.');
        const detail: GraphViewDomControllerEventDetail = event.detail;
        expect(detail.controller).toBe(controller);
        expect(event.bubbles).toBe(true);
        browserEvents.push(name);
      });
    }

    const callbacks = createGraphViewDomCallbacks(
      {
        onReady: received => {
          expect(received).toBe(controller);
          observed.push('ready');
        },
        onLayoutComplete: received => {
          expect(received).toBe(controller);
          observed.push('layout');
        },
      },
      { current: host },
    );
    callbacks.onReady?.(controller);
    callbacks.onLayoutComplete?.(controller);

    expect(observed).toEqual(['ready', 'layout']);
    expect(browserEvents).toEqual([
      'zora-graph-view-ready',
      'zora-graph-view-layout-complete',
    ]);
    expect(controller.measureNodes?.(['src'])?.nodes[0]?.id).toBe('src');
  },
);

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
function createController(): GraphViewController {
  return {
    fit() {},
    measureNodes(ids) {
      return {
        nodes: ids.map(id => ({
          id,
          position: { x: 120, y: 80 },
          size: { width: 100, height: 48 },
        })),
        viewport: { width: 800, height: 600 },
      };
    },
    getViewport: () => ({ pan: { x: 0, y: 0 }, zoom: 1 }),
    getZoomRange: () => ({ min: 0.5, max: 2 }),
    setPan() {},
    setZoom() {},
    zoomBy() {},
  };
}
