import './createGraphRuntime';

import { expect, test } from 'bun:test';
import cytoscape from 'cytoscape';

import { createGraphRuntime } from './createGraphRuntime';
import type { GraphViewCallbacks, GraphViewController } from './GraphView';

test('registers ELK with a Cytoscape-compatible layout constructor', () => {
  const cy = cytoscape({
    elements: [
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      { data: { id: 'a-b', source: 'a', target: 'b' } },
    ],
    headless: true,
  });

  try {
    expect(() => cy.layout({ name: 'elk', animate: false })).not.toThrow();
  } finally {
    cy.destroy();
  }
});

test('fits changed topology but preserves viewport and avoids relayout for highlights', async () => {
  const initial = Promise.withResolvers<GraphViewController>();
  const changed = Promise.withResolvers<GraphViewController>();
  const calls = { sort: 0 };
  const callbacks: { current: GraphViewCallbacks } = {
    current: { onReady: initial.resolve },
  };
  const runtime = createGraphRuntime(undefined, callbacks);
  const input = {
    nodes: [{ id: 'a' }, { id: 'b' }],
    edges: [{ source: 'a', target: 'b' }],
    layout: 'grid' as const,
    layoutOptions: {
      sort: () => {
        calls.sort += 1;
        return 0;
      },
    },
    richNodeRendering: false,
  };
  try {
    runtime.update(input);
    const controller = await initial.promise;
    controller.setZoom(0.7);
    controller.setPan({ x: 40, y: 30 });
    const sortCount = calls.sort;
    runtime.update({ ...input, nodes: [{ id: 'a', classes: 'highlight' }, { id: 'b' }] });
    expect(calls.sort).toBe(sortCount);
    expect(controller.getViewport()).toEqual({ zoom: 0.7, pan: { x: 40, y: 30 } });

    callbacks.current = { onLayoutComplete: changed.resolve };
    runtime.update({ ...input, nodes: [...input.nodes, { id: 'c' }] });
    await changed.promise;
    expect(calls.sort).toBeGreaterThan(sortCount);
    expect(controller.getViewport().zoom).not.toBe(0.7);
  } finally {
    runtime.destroy();
  }
});
