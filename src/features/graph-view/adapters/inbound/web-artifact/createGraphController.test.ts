import { expect, test } from 'bun:test';
import cytoscape, { type Core } from 'cytoscape';

import { createGraphController } from './createGraphController';

test('keeps fit-relative zoom and limits stable across spacing, resize, and navigation', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    layout: { name: 'preset' },
    elements: [
      { data: { id: 'a' }, position: { x: 0, y: 0 } },
      { data: { id: 'b' }, position: { x: 300, y: 200 } },
    ],
  });
  cy.width = () => 800;
  cy.height = () => 600;
  const owner = createGraphController(cy, { current: 50 });
  const { controller } = owner;
  owner.configure({
    nodes: [],
    edges: [],
    richNodeRendering: false,
    zoomMode: 'fit-relative',
    minZoom: 0.25,
    maxZoom: 4,
  });
  try {
    owner.settle(true);
    expect(controller.getViewport().zoom).toBeCloseTo(1);
    const firstScale = cy.zoom();
    controller.setZoom(2);
    expect(controller.getViewport().zoom).toBeCloseTo(2);
    cy.getElementById('b').position({ x: 900, y: 700 });
    owner.settle(false);
    expect(controller.getViewport().zoom).toBeCloseTo(2);
    expect(cy.zoom()).toBeLessThan(firstScale * 2);
    controller.fit();
    expect(controller.getViewport().zoom).toBeCloseTo(1);
    expect(cy.minZoom() / cy.zoom()).toBeCloseTo(0.25);
    expect(cy.maxZoom() / cy.zoom()).toBeCloseTo(4);
    controller.setZoom(100);
    expect(controller.getViewport().zoom).toBeCloseTo(4);
    controller.zoomBy(0.001);
    expect(controller.getViewport().zoom).toBeCloseTo(0.25);
    cy.width = () => 1200;
    owner.settle(true);
    expect(controller.getViewport().zoom).toBeCloseTo(1);
    cy.add({ data: { id: 'c' }, position: { x: 2000, y: 1000 } });
    owner.settle(true);
    expect(controller.getViewport().zoom).toBeCloseTo(1);
  } finally {
    cy.destroy();
  }
});

test('keeps absolute zoom semantics for consumers that do not opt in', () => {
  const cy = cytoscape({ headless: true, elements: [{ data: { id: 'a' } }] });
  const owner = createGraphController(cy, { current: 0 });
  try {
    owner.configure({ nodes: [], edges: [], richNodeRendering: false });
    owner.controller.setZoom(0.7);
    owner.settle(false);
    expect(owner.controller.getViewport().zoom).toBe(0.7);
    expect(cy.zoom()).toBe(0.7);
  } finally {
    cy.destroy();
  }
});

test('preserves manual pan while recomputing a fit-relative zoom reference', () => {
  const cy = cytoscape({
    headless: true,
    elements: [{ data: { id: 'a' } }, { data: { id: 'b' }, position: { x: 300, y: 200 } }],
  });
  cy.width = () => 800;
  cy.height = () => 600;
  const owner = createGraphController(cy, { current: 50 });
  owner.configure({ nodes: [], edges: [], richNodeRendering: false, zoomMode: 'fit-relative' });
  try {
    owner.settle(true);
    owner.controller.setPan({ x: 140, y: 90 });
    owner.settle(false);
    expect(owner.controller.getViewport().pan).toEqual({ x: 140, y: 90 });
  } finally {
    cy.destroy();
  }
});

test('preserves the manual fit-relative center through grow and sidebar resizes', () => {
  let width = 800;
  let height = 600;
  const cy = cytoscape({
    headless: true,
    elements: [
      { data: { id: 'a' }, position: { x: 0, y: 0 } },
      { data: { id: 'b' }, position: { x: 100, y: 80 } },
    ],
  });
  cy.width = () => width;
  cy.height = () => height;
  const owner = createGraphController(cy, { current: 0 });
  owner.configure({ nodes: [], edges: [], richNodeRendering: false, zoomMode: 'fit-relative' });
  try {
    owner.settle(true);
    owner.controller.setZoom(0.5);
    owner.controller.setPan({ x: 330, y: 250 });
    const center = getViewportModelCenter(cy, width, height);

    owner.beginResize();
    width = 1000;
    height = 700;
    owner.settle(false);
    expect(owner.controller.getViewport().zoom).toBeCloseTo(0.5);
    expectViewportModelCenter(cy, width, height, center);

    owner.beginResize();
    width = 700;
    owner.settle(false);
    expect(owner.controller.getViewport().zoom).toBeCloseTo(0.5);
    expectViewportModelCenter(cy, width, height, center);
  } finally {
    cy.destroy();
  }
});

test('fits only when a shrink clips graph bounds that were previously visible', () => {
  let width = 800;
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    layout: { name: 'preset' },
    elements: [
      { data: { id: 'a' }, position: { x: 0, y: 0 } },
      { data: { id: 'b' }, position: { x: 300, y: 200 } },
    ],
    style: [{ selector: 'node', style: { height: 40, width: 40 } }],
  });
  cy.width = () => width;
  cy.height = () => 600;
  const owner = createGraphController(cy, { current: 0 });
  owner.configure({ nodes: [], edges: [], richNodeRendering: false });
  try {
    owner.settle(true);
    owner.beginResize();
    width = 200;
    owner.settle(false);
    expectRenderedNodesToFit(cy, width, 600);
  } finally {
    cy.destroy();
  }
});

test('keeps an intentionally clipped manual absolute viewport instead of auto-fitting it', () => {
  let width = 800;
  const cy = cytoscape({
    headless: true,
    elements: [
      { data: { id: 'a' }, position: { x: 0, y: 0 } },
      { data: { id: 'b' }, position: { x: 300, y: 200 } },
    ],
  });
  cy.width = () => width;
  cy.height = () => 600;
  const owner = createGraphController(cy, { current: 0 });
  owner.configure({ nodes: [], edges: [], richNodeRendering: false });
  try {
    owner.settle(true);
    owner.controller.setPan({ x: -600, y: -400 });
    const center = getViewportModelCenter(cy, width, 600);
    owner.beginResize();
    width = 700;
    owner.settle(false);
    expectViewportModelCenter(cy, width, 600, center);
    expect(cy.nodes().renderedBoundingBox().x2).toBeLessThan(0);
  } finally {
    cy.destroy();
  }
});

test('caps automatic label size for tiny graphs and expands manual zoom for large graphs', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    layout: { name: 'preset' },
    elements: [{ data: { id: 'a' } }],
    style: [{ selector: 'node', style: { label: 'data(id)', 'font-size': 14 } }],
  });
  cy.width = () => 1000;
  cy.height = () => 800;
  const owner = createGraphController(cy, { current: 50 });
  owner.configure({
    nodes: [],
    edges: [],
    richNodeRendering: false,
    zoomMode: 'fit-relative',
    minZoom: 0.5,
    maxZoom: 2,
    minReadableLabelSize: 16,
    maxFitLabelSize: 24,
  });
  try {
    owner.settle(true);
    expect(cy.zoom() * 14).toBeCloseTo(24);
    expect(owner.getFitZoomLimit()).toBeCloseTo(24 / 14);
    expect(owner.getReadableZoomTarget()).toBeCloseTo(16 / 14);
    expect(owner.controller.getViewport().zoom).toBeCloseTo(1);
    cy.add({ data: { id: 'b' }, position: { x: 10000, y: 0 } });
    owner.settle(true);
    const range = owner.controller.getZoomRange();
    expect(range.max).toBeGreaterThan(2);
    owner.controller.setZoom(range.max);
    expect(cy.zoom() * 14).toBeGreaterThanOrEqual(16);
    owner.controller.fit();
    expect(owner.controller.getViewport().zoom).toBeCloseTo(1);
  } finally {
    cy.destroy();
  }
});

test('measures requested rendered nodes without exposing Cytoscape', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    layout: { name: 'preset' },
    elements: [
      { data: { id: 'a' }, position: { x: 40, y: 60 } },
      { data: { id: 'b' }, position: { x: 240, y: 180 } },
    ],
    style: [{ selector: 'node', style: { width: 40, height: 30 } }],
  });
  cy.width = () => 800;
  cy.height = () => 600;
  const { controller } = createGraphController(cy, { current: 50 });

  try {
    const measurement = controller.measureNodes?.(['a', 'missing']);
    const node = cy.getElementById('a');
    const bounds = node.renderedBoundingBox();

    expect(measurement).toEqual({
      viewport: { width: 800, height: 600 },
      nodes: [
        {
          id: 'a',
          position: node.renderedPosition(),
          size: { width: bounds.w, height: bounds.h },
        },
      ],
    });
    expect(controller.measureNodes?.([])).toBeNull();

    cy.width = () => 0;
    expect(controller.measureNodes?.(['a'])).toBeNull();
  } finally {
    cy.destroy();
  }
});

function getViewportModelCenter(cy: Core, width: number, height: number) {
  const pan = cy.pan();
  return {
    x: (width / 2 - pan.x) / cy.zoom(),
    y: (height / 2 - pan.y) / cy.zoom(),
  };
}

function expectRenderedNodesToFit(cy: Core, width: number, height: number) {
  const bounds = cy.nodes().renderedBoundingBox();
  expect(bounds.x1).toBeGreaterThanOrEqual(0);
  expect(bounds.y1).toBeGreaterThanOrEqual(0);
  expect(bounds.x2).toBeLessThanOrEqual(width);
  expect(bounds.y2).toBeLessThanOrEqual(height);
}

function expectViewportModelCenter(
  cy: Core,
  width: number,
  height: number,
  expected: { readonly x: number; readonly y: number },
) {
  const actual = getViewportModelCenter(cy, width, height);
  expect(actual.x).toBeCloseTo(expected.x);
  expect(actual.y).toBeCloseTo(expected.y);
}
