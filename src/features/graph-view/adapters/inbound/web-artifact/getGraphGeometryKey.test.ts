import { expect, test } from 'bun:test';
import cytoscape from 'cytoscape';

import { getGraphGeometryKey } from './getGraphGeometryKey';
import { syncGraphElements } from './syncGraphElements';

test('uses body, padding, borders and labels while ignoring paint-only presentation', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    style: [
      {
        selector: 'node',
        style: { width: 'data(width)', height: 24, padding: 8, 'border-width': 2 },
      },
      { selector: 'node.highlight', style: { 'background-color': '#ff0000' } },
      { selector: 'node.hovered', style: { 'overlay-opacity': 0.4 } },
      { selector: 'node:selected', style: { 'outline-width': 2 } },
      { selector: 'node.expanded', style: { padding: 16, width: 160 } },
    ],
  });
  try {
    syncGraphElements(cy, [{ id: 'a', data: { width: 80 } }], []);
    const before = getGraphGeometryKey(cy);
    syncGraphElements(cy, [{ id: 'a', classes: 'highlight', data: { width: 80 } }], []);
    expect(cy.getElementById('a').style('background-color')).toBe('rgb(255,0,0)');
    expect(getGraphGeometryKey(cy)).toBe(before);
    cy.getElementById('a').select();
    expect(getGraphGeometryKey(cy)).toBe(before);
    syncGraphElements(cy, [{ id: 'a', classes: 'hovered', data: { width: 80 } }], []);
    expect(getGraphGeometryKey(cy)).toBe(before);
    syncGraphElements(cy, [{ id: 'a', classes: 'expanded', data: { width: 80 } }], []);
    expect(getGraphGeometryKey(cy)).not.toBe(before);
  } finally {
    cy.destroy();
  }
});

test('includes plain and Unicode label bounds when their font metrics change', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    elements: [{ data: { id: 'plain' } }, { data: { id: 'unicode' } }],
  });
  const plain = cy.getElementById('plain');
  const unicode = cy.getElementById('unicode');
  const labelBounds = new Map([
    ['plain', { h: 18, w: 42 }],
    ['unicode', { h: 18, w: 56 }],
  ]);
  const boundingBox = (id: string) => () => {
    const bounds = labelBounds.get(id);
    if (!bounds) throw new Error(`Missing label bounds for ${id}.`);
    return { x1: 0, x2: bounds.w, y1: 0, y2: bounds.h, ...bounds };
  };
  plain.boundingBox = boundingBox('plain');
  unicode.boundingBox = boundingBox('unicode');
  try {
    const before = getGraphGeometryKey(cy);
    labelBounds.set('unicode', { h: 22, w: 76 });
    expect(getGraphGeometryKey(cy)).not.toBe(before);
  } finally {
    cy.destroy();
  }
});

test('excludes compound bounds and edge paint while retaining child body geometry', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    elements: [
      { data: { id: 'parent' } },
      { data: { id: 'child', parent: 'parent' } },
      { data: { id: 'loop', source: 'child', target: 'child' } },
    ],
    style: [{ selector: 'node', style: { height: 24, width: 'data(width)' } }],
  });
  try {
    const child = cy.getElementById('child');
    child.data('width', 80);
    const before = getGraphGeometryKey(cy);
    cy.getElementById('parent').position({ x: 500, y: 400 });
    expect(getGraphGeometryKey(cy)).toBe(before);
    child.data('width', 160);
    expect(getGraphGeometryKey(cy)).not.toBe(before);
  } finally {
    cy.destroy();
  }
});
