import './createGraphRuntime';

import { expect, test } from 'bun:test';
import cytoscape from 'cytoscape';

import type {
  GraphViewCallbacks,
  GraphViewController,
  GraphViewElementEvent,
  GraphViewRenderedNode,
} from '../../../../../types/graph-view';
import { createGraphRuntime } from './createGraphRuntime';

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

test('preserves a stable topology removal without relayout, fit, or retained-node movement', async () => {
  const ready = Promise.withResolvers<GraphViewController>();
  const controllers: GraphViewController[] = [];
  const snapshots: (readonly GraphViewRenderedNode[])[] = [];
  const calls = { complete: 0, ready: 0, sort: 0 };
  const runtime = createGraphRuntime(undefined, {
    current: {
      onLayoutComplete: () => {
        calls.complete += 1;
      },
      onReady: (controller) => {
        calls.ready += 1;
        controllers.push(controller);
        ready.resolve(controller);
      },
    },
  });
  const unsubscribe = runtime.subscribeRenderedNodes((nodes) => snapshots.push(nodes));
  const nodes = Array.from({ length: 87 }, (_, index) => ({ id: `repository-${index}` }));
  const input = {
    nodes,
    edges: nodes.slice(1).flatMap((node, index) => {
      const source = nodes.at(index);
      return source ? [{ id: `dependency-${index}`, source: source.id, target: node.id }] : [];
    }),
    layout: 'grid' as const,
    layoutOptions: {
      sort: () => {
        calls.sort += 1;
        return 0;
      },
    },
    richNodeRendering: true,
    topologyUpdatePolicy: 'preserve-positions' as const,
  };
  try {
    runtime.update(input);
    const controller = await ready.promise;
    controller.setZoom(0.7);
    controller.setPan({ x: 40, y: 30 });
    runtime.setSelectedNodeIds(['repository-0']);
    const retainedIds = nodes.slice(0, -1).map((node) => node.id);
    const before = controller.measureNodes?.(retainedIds);
    const viewport = controller.getViewport();
    const sortCount = calls.sort;

    runtime.update({
      ...input,
      nodes: nodes.slice(0, -1),
      edges: input.edges.slice(0, -1),
    });
    expect(
      controller.measureNodes?.(retainedIds)?.nodes.map(({ id, position }) => ({ id, position })),
    ).toEqual(before?.nodes.map(({ id, position }) => ({ id, position })));
    await new Promise((resolve) => setTimeout(resolve, 0));
    runtime.setNodeSize('repository-0', { height: 24, width: 48 });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(
      controller.measureNodes?.(retainedIds)?.nodes.map(({ id, position }) => ({ id, position })),
    ).toEqual(before?.nodes.map(({ id, position }) => ({ id, position })));
    expect(controller.getViewport()).toEqual(viewport);
    expect(snapshots.at(-1)?.find((node) => node.id === 'repository-0')?.selected).toBe(true);
    expect(calls.ready).toBe(1);
    expect(controllers).toEqual([controller]);
    expect(calls.complete).toBe(1);
    expect(calls.sort).toBe(sortCount);
  } finally {
    unsubscribe();
    runtime.destroy();
  }
});

test('keeps added compound targets inside a preserved user viewport without relayout', async () => {
  await withGraphViewportAsync(async () => {
    const ready = Promise.withResolvers<GraphViewController>();
    const calls = { ready: 0, sort: 0 };
    const controllers: GraphViewController[] = [];
    const runtime = createGraphRuntime(undefined, {
      current: {
        onReady: (controller) => {
          calls.ready += 1;
          controllers.push(controller);
          ready.resolve(controller);
        },
      },
    });
    const input = {
      nodes: [{ id: 'README' }, { id: 'src' }],
      edges: [],
      layout: 'grid' as const,
      layoutOptions: {
        sort: () => {
          calls.sort += 1;
          return 0;
        },
      },
      richNodeRendering: false,
      topologyUpdatePolicy: 'preserve-positions' as const,
    };
    try {
      runtime.update(input);
      const controller = await ready.promise;
      controller.fit();
      controller.setZoom(0.8);
      controller.setPan({ x: -40, y: -30 });
      const viewport = controller.getViewport();
      const retainedPosition = controller.measureNodes?.(['README']);
      const sortCount = calls.sort;

      runtime.update({
        ...input,
        nodes: [
          { id: 'README' },
          { id: 'src' },
          { id: 'src.features', parentId: 'src' },
          { id: 'src.features.nested', parentId: 'src.features' },
        ],
      });

      expect(controller.getViewport()).toEqual(viewport);
      expect(viewport).toEqual({ zoom: 0.8, pan: { x: -40, y: -30 } });
      expect(controller.measureNodes?.(['README'])).toEqual(retainedPosition);
      expect(calls.ready).toBe(1);
      expect(controllers).toEqual([controller]);
      expect(calls.sort).toBe(sortCount);
      expectCompoundMeasurementsToFitViewport(controller, ['src.features', 'src.features.nested']);
    } finally {
      runtime.destroy();
    }
  });
});

test('lays out a late initial rich-node measurement without a topology change', async () => {
  const ready = Promise.withResolvers<GraphViewController>();
  const completed = Promise.withResolvers<void>();
  const calls = { sort: 0 };
  const callbacks: { current: GraphViewCallbacks } = { current: { onReady: ready.resolve } };
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
    richNodeRendering: true,
    topologyUpdatePolicy: 'preserve-positions' as const,
  };
  try {
    runtime.update(input);
    await ready.promise;
    const sortCount = calls.sort;
    callbacks.current = { onLayoutComplete: () => completed.resolve() };

    runtime.setNodeSize('a', { height: 24, width: 48 });
    await completed.promise;

    expect(calls.sort).toBeGreaterThan(sortCount);
  } finally {
    runtime.destroy();
  }
});

test('keeps explicit fit and layout available after preserving a rich-node topology removal', async () => {
  const ready = Promise.withResolvers<GraphViewController>();
  const completed = Promise.withResolvers<void>();
  const calls = { sort: 0 };
  const callbacks: { current: GraphViewCallbacks } = { current: { onReady: ready.resolve } };
  const runtime = createGraphRuntime(undefined, callbacks);
  const nodes = Array.from({ length: 87 }, (_, index) => ({ id: `repository-${index}` }));
  const input = {
    nodes,
    edges: nodes.slice(1).flatMap((node, index) => {
      const source = nodes.at(index);
      return source ? [{ id: `dependency-${index}`, source: source.id, target: node.id }] : [];
    }),
    layout: 'grid' as const,
    layoutOptions: {
      sort: () => {
        calls.sort += 1;
        return 0;
      },
    },
    richNodeRendering: true,
    topologyUpdatePolicy: 'preserve-positions' as const,
  };
  try {
    runtime.update(input);
    const controller = await ready.promise;
    controller.setZoom(0.7);
    controller.setPan({ x: 40, y: 30 });
    const preservedInput = {
      ...input,
      nodes: nodes.slice(0, -1),
      edges: input.edges.slice(0, -1),
    };
    runtime.update(preservedInput);
    runtime.setNodeSize('repository-0', { height: 24, width: 48 });
    await new Promise((resolve) => setTimeout(resolve, 0));
    const preservedSorts = calls.sort;
    const preservedViewport = controller.getViewport();

    controller.fit();
    expect(controller.getViewport()).not.toEqual(preservedViewport);
    callbacks.current = { onLayoutComplete: () => completed.resolve() };
    runtime.update({ ...preservedInput, layout: 'circle' });
    await completed.promise;

    expect(calls.sort).toBeGreaterThan(preservedSorts);
    const explicitLayoutSorts = calls.sort;
    const measured = Promise.withResolvers<void>();
    callbacks.current = { onLayoutComplete: () => measured.resolve() };
    runtime.setNodeSize('repository-1', { height: 24, width: 48 });
    await measured.promise;

    expect(calls.sort).toBeGreaterThan(explicitLayoutSorts);
  } finally {
    runtime.destroy();
  }
});

test('fits a changed layout algorithm even when visible topology is unchanged', async () => {
  const initial = Promise.withResolvers<GraphViewController>();
  const completed = Promise.withResolvers<GraphViewController>();
  const callbacks: { current: GraphViewCallbacks } = { current: { onReady: initial.resolve } };
  const runtime = createGraphRuntime(undefined, callbacks);
  const input = {
    nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    edges: [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ],
    layout: 'grid' as const,
    richNodeRendering: false,
    zoomMode: 'fit-relative' as const,
  };
  try {
    runtime.update(input);
    const controller = await initial.promise;
    controller.setZoom(0.7);
    controller.setPan({ x: 40, y: 30 });
    callbacks.current = { onLayoutComplete: completed.resolve };
    runtime.update({ ...input, layout: 'circle' });
    const settled = await completed.promise;
    expect(settled.getViewport().zoom).not.toBeCloseTo(0.7);
    expectMeasuredNodesToFit(settled, ['a', 'b', 'c']);
  } finally {
    runtime.destroy();
  }
});

function expectMeasuredNodesToFit(controller: GraphViewController, nodeIds: readonly string[]) {
  const measurement = controller.measureNodes?.(nodeIds);
  expect(measurement).not.toBeNull();
  if (measurement === null) return;
  for (const node of measurement.nodes) {
    expect(node.position.x - node.size.width / 2).toBeGreaterThanOrEqual(0);
    expect(node.position.y - node.size.height / 2).toBeGreaterThanOrEqual(0);
    expect(node.position.x + node.size.width / 2).toBeLessThanOrEqual(measurement.viewport.width);
    expect(node.position.y + node.size.height / 2).toBeLessThanOrEqual(measurement.viewport.height);
  }
}

function expectCompoundMeasurementsToFitViewport(
  controller: GraphViewController,
  nodeIds: readonly string[],
) {
  const measurement = controller.measureNodes?.(nodeIds);
  expect(measurement).not.toBeNull();
  if (measurement === null) return;
  expect(measurement.viewport).toEqual({ width: 992, height: 440 });
  expect(measurement.nodes).toHaveLength(2);
  expect(measurement.nodes.map((node) => node.id)).toEqual(nodeIds);
  for (const node of measurement.nodes) {
    expect(Number.isFinite(node.position.x)).toBe(true);
    expect(Number.isFinite(node.position.y)).toBe(true);
    expect(node.size.width).toBeGreaterThan(0);
    expect(node.size.height).toBeGreaterThan(0);
    const left = node.position.x - node.size.width / 2;
    const right = node.position.x + node.size.width / 2;
    const top = node.position.y - node.size.height / 2;
    const bottom = node.position.y + node.size.height / 2;
    expect(left).toBeGreaterThanOrEqual(0);
    expect(right).toBeLessThanOrEqual(measurement.viewport.width);
    expect(top).toBeGreaterThanOrEqual(0);
    expect(bottom).toBeLessThanOrEqual(measurement.viewport.height);
    expect(node.position.x).toBeGreaterThanOrEqual(left);
    expect(node.position.x).toBeLessThanOrEqual(right);
    expect(node.position.y).toBeGreaterThanOrEqual(top);
    expect(node.position.y).toBeLessThanOrEqual(bottom);
  }
}

async function withGraphViewportAsync(run: () => Promise<void>) {
  const probe = cytoscape({ headless: true });
  const core = Object.getPrototypeOf(probe) as { height: () => number; width: () => number };
  probe.destroy();
  const { height, width } = core;
  core.height = () => 440;
  core.width = () => 992;
  try {
    await run();
  } finally {
    core.height = height;
    core.width = width;
  }
}

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

test('does not relayout when controlled selection adds a paint-only outline', async () => {
  const ready = Promise.withResolvers<GraphViewController>();
  const calls = { sort: 0 };
  const runtime = createGraphRuntime(undefined, { current: { onReady: ready.resolve } });
  const input = {
    nodes: [
      { id: 'src', label: 'src' },
      { id: 'dependency', label: 'dependency' },
    ],
    edges: [{ source: 'src', target: 'dependency' }],
    layout: 'grid' as const,
    layoutOptions: {
      sort: () => {
        calls.sort += 1;
        return 0;
      },
    },
    richNodeRendering: false,
    sizeNodesToLabels: true,
    styleRules: [
      {
        selector: 'node',
        style: { height: 24, label: 'data(label)', padding: '12px', width: 24 },
      },
      { selector: 'node:selected', style: { 'outline-width': 2 } },
    ],
  };
  try {
    runtime.update(input);
    await ready.promise;
    const sortCount = calls.sort;
    runtime.setSelectedNodeIds(['src']);
    runtime.update({
      ...input,
      nodes: [
        { id: 'src', classes: 'highlight', label: 'src' },
        { id: 'dependency', label: 'dependency' },
      ],
    });
    expect(calls.sort).toBe(sortCount);
  } finally {
    runtime.destroy();
  }
});

test('forwards semantic selection intent from rich-node press events', async () => {
  const ready = Promise.withResolvers<GraphViewController>();
  const events: GraphViewElementEvent[] = [];
  const runtime = createGraphRuntime(undefined, {
    current: { onReady: ready.resolve, onNodeEvent: (event) => events.push(event) },
  });
  try {
    runtime.update({
      nodes: [{ id: 'a' }],
      edges: [],
      layout: 'grid',
      richNodeRendering: false,
    });
    await ready.promise;
    runtime.handleOverlayNodeEvent('a', 'press', 'toggle');
    expect(events.at(-1)).toEqual({ id: 'a', type: 'press', selectionIntent: 'toggle' });
  } finally {
    runtime.destroy();
  }
});

test('settles the pending initial layout when presentation changes before readiness', async () => {
  const ready = Promise.withResolvers<GraphViewController>();
  const calls = { completed: 0, ready: 0, sort: 0 };
  const runtime = createGraphRuntime(undefined, {
    current: {
      onLayoutComplete: () => {
        calls.completed += 1;
      },
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
    runtime.update({ ...input, nodes: [{ id: 'a', classes: 'hovered' }, { id: 'b' }] });
    await ready.promise;
    expect(calls.ready).toBe(1);
    expect(calls.completed).toBe(1);
    expect(calls.sort).toBeGreaterThan(0);
  } finally {
    runtime.destroy();
  }
});

test('lays out 0 → 1 → 5 topology updates before preserve-positions becomes active', async () => {
  const ready = Promise.withResolvers<GraphViewController>();
  const calls = { completed: 0, sort: 0 };
  const runtime = createGraphRuntime(undefined, {
    current: {
      onLayoutComplete: () => {
        calls.completed += 1;
      },
      onReady: ready.resolve,
    },
  });
  const layoutOptions = {
    sort: () => {
      calls.sort += 1;
      return 0;
    },
  };
  const fiveNodes = Array.from({ length: 5 }, (_, index) => ({ id: `repository-${index}` }));
  const input = {
    edges: [],
    layout: 'grid' as const,
    layoutOptions,
    richNodeRendering: false,
    topologyUpdatePolicy: 'preserve-positions' as const,
  };
  try {
    runtime.update({ ...input, nodes: [] });
    runtime.update({ ...input, nodes: fiveNodes.slice(0, 1) });
    runtime.update({ ...input, nodes: fiveNodes });
    const controller = await ready.promise;

    expect(calls.completed).toBe(1);
    expect(controller.measureNodes?.(fiveNodes.map((node) => node.id))?.nodes).toHaveLength(5);
  } finally {
    runtime.destroy();
  }
});
