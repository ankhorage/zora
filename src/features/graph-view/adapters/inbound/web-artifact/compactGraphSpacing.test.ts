import { expect, test } from 'bun:test';
import cytoscape, { type NodeSingular } from 'cytoscape';

import { compactGraphSpacing } from './compactGraphSpacing';

test('compacts around measured labels while allowing node backgrounds to overlap', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    layout: { name: 'preset' },
    elements: [
      { data: { id: 'a' }, position: { x: 0, y: 0 } },
      { data: { id: 'b' }, position: { x: 200, y: 0 } },
      { data: { id: 'e', source: 'a', target: 'b', weight: 7 } },
    ],
    style: [{ selector: 'node', style: { width: 100, height: 40, padding: '0px' } }],
  });
  try {
    const a = cy.getElementById('a');
    const b = cy.getElementById('b');
    installMeasuredLabelBox(a, 40, 20);
    installMeasuredLabelBox(b, 40, 20);

    const factor = compactGraphSpacing(cy, 1);
    expect(factor).toBeGreaterThan(0.17);
    expect(factor).toBeLessThan(0.19);
    expect(b.boundingBox().x1 - a.boundingBox().x2).toBeLessThan(0);

    const labelA = readLabelBox(a);
    const labelB = readLabelBox(b);
    const overlap = Math.min(labelA.x2, labelB.x2) - Math.max(labelA.x1, labelB.x1);
    expect(overlap).toBeGreaterThan(0);
    expect(overlap).toBeLessThanOrEqual(40 * 0.12 + 0.2);
    expect(cy.edges()[0].data('weight')).toBe(7);
    expect(a.width()).toBe(100);
  } finally {
    cy.destroy();
  }
});

test('expands a uniformly cramped layout only until measured labels are readable', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    layout: { name: 'preset' },
    elements: [
      { data: { id: 'a' }, position: { x: 0, y: 0 } },
      { data: { id: 'b' }, position: { x: 20, y: 0 } },
    ],
    style: [{ selector: 'node', style: { width: 100, height: 40, padding: '0px' } }],
  });
  try {
    installMeasuredLabelBox(cy.getElementById('a'), 40, 20);
    installMeasuredLabelBox(cy.getElementById('b'), 40, 20);

    const factor = compactGraphSpacing(cy, 0.1);
    expect(factor).toBeGreaterThan(0.17);
    expect(factor).toBeLessThan(0.19);
    const labelA = readLabelBox(cy.getElementById('a'));
    const labelB = readLabelBox(cy.getElementById('b'));
    expect(Math.min(labelA.x2, labelB.x2) - Math.max(labelA.x1, labelB.x1)).toBeLessThanOrEqual(
      40 * 0.12 + 0.2,
    );
  } finally {
    cy.destroy();
  }
});

test('preserves locked or non-uniformly overlapping views', () => {
  for (const locked of [false, true]) {
    const cy = cytoscape({
      headless: true,
      styleEnabled: true,
      layout: { name: 'preset' },
      elements: [
        { data: { id: 'a' }, position: { x: 0, y: 0 }, locked },
        { data: { id: 'b' }, position: { x: locked ? 500 : 0, y: 0 } },
      ],
    });
    try {
      expect(compactGraphSpacing(cy, 1)).toBe(1);
    } finally {
      cy.destroy();
    }
  }
});

test('allows parent-child containment but keeps compound peer groups separated', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    layout: { name: 'preset' },
    elements: [
      { data: { id: 'p' } },
      { data: { id: 'p.a', parent: 'p' }, position: { x: 0, y: 0 } },
      { data: { id: 'q' } },
      { data: { id: 'q.a', parent: 'q' }, position: { x: 800, y: 0 } },
    ],
  });
  try {
    expect(compactGraphSpacing(cy, 1)).toBeLessThan(1);
    expect(
      cy.getElementById('q').boundingBox().x1 - cy.getElementById('p').boundingBox().x2,
    ).toBeGreaterThanOrEqual(0);
    expect(cy.getElementById('p.a').data('parent')).toBe('p');
  } finally {
    cy.destroy();
  }
});

/*** Install a dynamic renderer-style label box for headless Cytoscape tests. */
function installMeasuredLabelBox(node: NodeSingular, width: number, height: number): void {
  const originalBoundingBox = node.boundingBox.bind(node);
  node.boundingBox = (options) => {
    if (options?.includeNodes !== false) return originalBoundingBox(options);
    const position = node.position();
    return {
      x1: position.x - width / 2,
      y1: position.y - height / 2,
      x2: position.x + width / 2,
      y2: position.y + height / 2,
      w: width,
      h: height,
    };
  };
}

/*** Read only the renderer-measured label box from one test node. */
function readLabelBox(node: NodeSingular) {
  return node.boundingBox({
    includeNodes: false,
    includeEdges: false,
    includeLabels: true,
    includeOverlays: false,
    includeUnderlays: false,
  });
}
