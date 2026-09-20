import './createGraphRuntime';

import { expect, test } from 'bun:test';
import cytoscape from 'cytoscape';

import { createGraphRuntime } from './createGraphRuntime';
import type {
  GraphViewCallbacks,
  GraphViewController,
  GraphViewElementEvent,
  GraphViewRenderedNode,
} from './GraphView';

test('explicit fit compacts once and controlled spacing acknowledgement does not rerun the algorithm', async () => {
  const initial = Promise.withResolvers<GraphViewController>();
  const calls = { sort: 0, spacing: 8 };
  const callbacks = {
    current: {
      onReady: initial.resolve,
      onSpacingFactorChange: (spacing: number) => {
        calls.spacing = spacing;
      },
    },
  };
  const runtime = createGraphRuntime(undefined, callbacks);
  const input = {
    nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    edges: [],
    layout: 'grid' as const,
    spacingFactor: 8,
    layoutOptions: {
      boundingBox: { x1: 0, y1: 0, w: 1000, h: 800 },
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
    const sortCount = calls.sort;
    controller.fit({ optimizeSpacing: true });
    expect(calls.spacing).toBeLessThan(8);
    runtime.update({ ...input, spacingFactor: calls.spacing });
    expect(calls.sort).toBe(sortCount);
    controller.setZoom(1.5);
    expect(calls.sort).toBe(sortCount);
  } finally {
    runtime.destroy();
  }
});

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

test('preserves selection and positions through hover presentation updates without relayout', async () => {
  const ready = Promise.withResolvers<GraphViewController>();
  const events: GraphViewElementEvent[] = [];
  const snapshots: (readonly GraphViewRenderedNode[])[] = [];
  const calls = { sort: 0 };
  const runtime = createGraphRuntime(undefined, {
    current: { onReady: ready.resolve, onNodeEvent: (event) => events.push(event) },
  });
  const unsubscribe = runtime.subscribeRenderedNodes((nodes) => snapshots.push(nodes));
  const input = {
    nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    edges: [{ id: 'ab', source: 'a', target: 'b' }],
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
    const controller = await ready.promise;
    controller.setZoom(0.7);
    controller.setPan({ x: 40, y: 30 });
    runtime.setSelectedNodeIds(['a']);
    const before = snapshots.at(-1);
    const sortCount = calls.sort;

    runtime.handleOverlayNodeEvent('b', 'pointer-enter');
    runtime.update({
      ...input,
      nodes: [
        { id: 'a', classes: 'neighbor' },
        { id: 'b', classes: 'hovered' },
        { id: 'c', classes: 'muted' },
      ],
      edges: [{ ...input.edges[0], classes: 'neighbor' }],
    });
    expect(snapshots.at(-1)?.find((node) => node.id === 'a')?.selected).toBe(true);
    expect(snapshots.at(-1)?.find((node) => node.id === 'b')?.hovered).toBe(true);
    runtime.handleOverlayNodeEvent('b', 'pointer-leave');
    runtime.update(input);

    expect(snapshots.at(-1)).toEqual(before);
    expect(controller.getViewport()).toEqual({ zoom: 0.7, pan: { x: 40, y: 30 } });
    expect(calls.sort).toBe(sortCount);
    expect(events).toEqual([
      { id: 'a', type: 'select' },
      { id: 'b', type: 'pointer-enter' },
      { id: 'b', type: 'pointer-leave' },
    ]);
    runtime.setSelectedNodeIds([]);
    expect(snapshots.at(-1)?.every((node) => !node.selected)).toBe(true);
    expect(events.at(-1)).toEqual({ id: 'a', type: 'unselect' });
    expect(calls.sort).toBe(sortCount);
  } finally {
    unsubscribe();
    runtime.destroy();
  }
});

test('settles the pending initial layout when presentation changes before readiness', async () => {
  const ready = Promise.withResolvers<GraphViewController>();
  const calls = { ready: 0, sort: 0 };
  const runtime = createGraphRuntime(undefined, {
    current: {
      onReady: (controller) => {
        calls.ready += 1;
        ready.resolve(controller);
      },
    },
  });
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
    const sortCount = calls.sort;
    runtime.update({ ...input, nodes: [{ id: 'a', classes: 'hovered' }, { id: 'b' }] });
    await ready.promise;
    expect(calls.ready).toBe(1);
    expect(calls.sort).toBe(sortCount);
  } finally {
    runtime.destroy();
  }
});
