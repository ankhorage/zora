import { expect, test } from 'bun:test';
import cytoscape from 'cytoscape';

import { sizeGraphNodesToLabels } from './sizeGraphNodesToLabels';

test('uses rendered label bounds, retains padding, and releases sizing when disabled', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    elements: [{ data: { id: 'long-label' } }],
    style: [{ selector: 'node', style: { width: 30, height: 20, padding: 12 } }],
  });
  const sized = new Set<string>();
  const node = cy.getElementById('long-label');
  const bounds = { width: 201.2, height: 18.4 };
  // The headless renderer cannot measure text; supply its public label-bounds result at this boundary.
  node.boundingBox = (options) => {
    expect(options?.includeNodes).toBe(false);
    expect(options?.includeLabels).toBe(true);
    return { x1: 0, y1: 0, x2: bounds.width, y2: bounds.height, w: bounds.width, h: bounds.height };
  };
  try {
    sizeGraphNodesToLabels(cy, sized, true);
    expect(node.width()).toBe(202);
    expect(node.height()).toBe(19);
    expect(node.outerWidth()).toBe(226);
    sizeGraphNodesToLabels(cy, sized, true);
    expect(node.width()).toBe(202);
    bounds.width = 300.6;
    sizeGraphNodesToLabels(cy, sized, true);
    expect(node.width()).toBe(301);
    sizeGraphNodesToLabels(cy, sized, false);
    expect(node.width()).toBe(30);
    expect(sized.size).toBe(0);
  } finally {
    cy.destroy();
  }
});
