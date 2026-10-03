import { expect, test } from 'bun:test';
import cytoscape, { type Core, type CytoscapeOptions, type NodeSingular } from 'cytoscape';

import { compactGraphSpacing } from './compactGraphSpacing';

const FIT_OPTIONS = { fitPadding: 50, maxFitZoom: 1 } as const;

test('keeps an already readable graph unchanged once the fit-size target is reached', () => {
  const cy = createGraph(
    [
      { data: { id: 'a' }, position: { x: 0, y: 0 } },
      { data: { id: 'b' }, position: { x: 300, y: 0 } },
    ],
    800,
    600,
  );
  try {
    const before = cy.getElementById('b').position();
    const spacing = compactGraphSpacing(cy, 1, { ...FIT_OPTIONS, maxFitZoom: 1.5 });
    expect(spacing).toBe(1);
    expect(cy.getElementById('b').position()).toEqual(before);
  } finally {
    cy.destroy();
  }
});

test(
  'compacts only until the effective fit reaches its cap while preserving node separation',
  () => {
    const cy = createGraph(
      [
        { data: { id: 'a' }, position: { x: 0, y: 0 } },
        { data: { id: 'b' }, position: { x: 1000, y: 0 } },
        { data: { id: 'e', source: 'a', target: 'b', weight: 7 } },
      ],
      800,
      600,
    );
    try {
      const spacing = compactGraphSpacing(cy, 1, FIT_OPTIONS);
      const first = cy.getElementById('a').boundingBox();
      const second = cy.getElementById('b').boundingBox();
      expect(spacing).toBeGreaterThan(0.59);
      expect(spacing).toBeLessThan(0.61);
      expect(second.x1 - first.x2).toBeGreaterThan(0);
      expect(cy.edges()[0].data('weight')).toBe(7);
      expect(cy.getElementById('a').width()).toBe(100);
    } finally {
      cy.destroy();
    }
  },
);

test(
  'uses a small rendered background-overlap budget only when strict separation cannot reach the fit target',
  () => {
    const cy = createGraph(
      [
        { data: { id: 'a' }, position: { x: 0, y: 0 } },
        { data: { id: 'b' }, position: { x: 120, y: 0 } },
      ],
      296,
      400,
    );
    installMeasuredLabelBox(cy.getElementById('a'), 40, 20);
    installMeasuredLabelBox(cy.getElementById('b'), 40, 20);
    try {
      const spacing = compactGraphSpacing(cy, 1, FIT_OPTIONS);
      const first = cy.getElementById('a').boundingBox({ includeLabels: false });
      const second = cy.getElementById('b').boundingBox({ includeLabels: false });
      const visualOverlap = Math.min(first.x2, second.x2) - Math.max(first.x1, second.x1);
      const firstLabel = readLabelBox(cy.getElementById('a'));
      const secondLabel = readLabelBox(cy.getElementById('b'));
      const labelOverlap =
        Math.min(firstLabel.x2, secondLabel.x2) - Math.max(firstLabel.x1, secondLabel.x1);

      expect(spacing).toBeGreaterThan(0.79);
      expect(spacing).toBeLessThan(0.81);
      expect(visualOverlap).toBeGreaterThan(0);
      expect(visualOverlap).toBeLessThanOrEqual(4.2);
      expect(labelOverlap).toBeLessThanOrEqual(0);
    } finally {
      cy.destroy();
    }
  },
);

test(
  'expands cramped labels and nodes when the viewport can keep them separated at the fit target',
  () => {
    const cy = createGraph(
      [
        { data: { id: 'a' }, position: { x: 0, y: 0 } },
        { data: { id: 'b' }, position: { x: 20, y: 0 } },
      ],
      800,
      600,
    );
    installMeasuredLabelBox(cy.getElementById('a'), 40, 20);
    installMeasuredLabelBox(cy.getElementById('b'), 40, 20);
    try {
      const spacing = compactGraphSpacing(cy, 0.1, FIT_OPTIONS);
      const first = cy.getElementById('a').boundingBox({ includeLabels: false });
      const second = cy.getElementById('b').boundingBox({ includeLabels: false });
      expect(spacing).toBeGreaterThanOrEqual(0.49);
      expect(second.x1 - first.x2).toBeGreaterThanOrEqual(-0.2);
      expect(
        Math.min(readLabelBox(cy.getElementById('a')).x2, readLabelBox(cy.getElementById('b')).x2) -
          Math.max(readLabelBox(cy.getElementById('a')).x1, readLabelBox(cy.getElementById('b')).x1),
      ).toBeLessThanOrEqual(0);
    } finally {
      cy.destroy();
    }
  },
);

test('preserves compound containment while keeping peer groups separated', () => {
  const cy = createGraph(
    [
      { data: { id: 'p' } },
      { data: { id: 'p.a', parent: 'p' }, position: { x: 0, y: 0 } },
      { data: { id: 'q' } },
      { data: { id: 'q.a', parent: 'q' }, position: { x: 800, y: 0 } },
    ],
    1000,
    600,
  );
  try {
    expect(compactGraphSpacing(cy, 1, { fitPadding: 50 })).toBeLessThan(1);
    expect(
      cy.getElementById('q').boundingBox().x1 - cy.getElementById('p').boundingBox().x2,
    ).toBeGreaterThanOrEqual(-0.2);
    expect(cy.getElementById('p.a').data('parent')).toBe('p');
  } finally {
    cy.destroy();
  }
});

test('is idempotent after a capped optimized fit', () => {
  const cy = createGraph(
    [
      { data: { id: 'a' }, position: { x: 0, y: 0 } },
      { data: { id: 'b' }, position: { x: 1000, y: 0 } },
    ],
    800,
    600,
  );
  try {
    const firstSpacing = compactGraphSpacing(cy, 1, FIT_OPTIONS);
    const firstPosition = { ...cy.getElementById('b').position() };
    const secondSpacing = compactGraphSpacing(cy, firstSpacing, FIT_OPTIONS);
    expect(secondSpacing).toBe(firstSpacing);
    expect(cy.getElementById('b').position()).toEqual(firstPosition);
  } finally {
    cy.destroy();
  }
});

/*** Create one measured headless graph with stable viewport and visual node dimensions. */
function createGraph(
  elements: CytoscapeOptions['elements'],
  width: number,
  height: number,
): Core {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    layout: { name: 'preset' },
    elements,
    style: [{ selector: 'node', style: { width: 100, height: 40, padding: '0px' } }],
  });
  cy.width = () => width;
  cy.height = () => height;
  return cy;
}

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
