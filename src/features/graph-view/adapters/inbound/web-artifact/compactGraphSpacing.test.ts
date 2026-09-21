import { expect, test } from 'bun:test';
import cytoscape from 'cytoscape';

import { compactGraphSpacing } from './compactGraphSpacing';

test('compacts the settled layout up to measured clearance without changing node sizes or edges', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    layout: { name: 'preset' },
    elements: [
      { data: { id: 'a' }, position: { x: 0, y: 0 } },
      { data: { id: 'b' }, position: { x: 500, y: 0 } },
      { data: { id: 'e', source: 'a', target: 'b', weight: 7 } },
    ],
    style: [{ selector: 'node', style: { width: 100, height: 40, padding: '0px' } }],
  });
  try {
    const factor = compactGraphSpacing(cy, 1);
    expect(factor).toBeLessThan(0.3);
    expect(factor).toBeGreaterThan(0.2);
    const a = cy.getElementById('a').boundingBox();
    const b = cy.getElementById('b').boundingBox();
    expect(b.x1 - a.x2).toBeGreaterThanOrEqual(8);
    expect(cy.edges().length).toBe(1);
    expect(cy.edges()[0].data('weight')).toBe(7);
    expect(cy.getElementById('a').width()).toBe(100);
    // A second bounded search may refine the first interval, but cannot cross the clearance.
    const refined = compactGraphSpacing(cy, factor);
    expect(factor - refined).toBeLessThan(1 / 128);
    expect(
      cy.getElementById('b').boundingBox().x1 - cy.getElementById('a').boundingBox().x2,
    ).toBeGreaterThanOrEqual(8);
  } finally {
    cy.destroy();
  }
});

test('expands a uniformly cramped layout to measured clearance', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    layout: { name: 'preset' },
    elements: [
      { data: { id: 'a' }, position: { x: 0, y: 0 } },
      { data: { id: 'b' }, position: { x: 50, y: 0 } },
    ],
    style: [{ selector: 'node', style: { width: 100, height: 40, padding: '0px' } }],
  });
  try {
    const factor = compactGraphSpacing(cy, 0.1);
    expect(factor).toBeGreaterThan(0.2);
    expect(factor).toBeLessThan(0.3);
    const a = cy.getElementById('a').boundingBox();
    const b = cy.getElementById('b').boundingBox();
    expect(b.x1 - a.x2).toBeGreaterThanOrEqual(8);
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

test('allows parent-child containment but preserves separation between compound groups', () => {
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
    ).toBeGreaterThanOrEqual(8);
    expect(cy.getElementById('p.a').data('parent')).toBe('p');
  } finally {
    cy.destroy();
  }
});
