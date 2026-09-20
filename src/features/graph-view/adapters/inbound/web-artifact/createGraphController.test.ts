import { expect, test } from 'bun:test';
import cytoscape from 'cytoscape';

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
