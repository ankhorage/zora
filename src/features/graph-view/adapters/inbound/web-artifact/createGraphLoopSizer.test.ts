import { expect, test } from 'bun:test';
import cytoscape from 'cytoscape';

import { createGraphLoopSizer } from './createGraphLoopSizer';

test('keeps Coderadar-sized self-loop control points outside wide nodes without changing dependencies', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    elements: {
      nodes: [116, 172, 151].map((width, index) => ({ data: { id: String(index), width } })),
      edges: [0, 1, 2].map((index) => ({
        data: {
          id: 'loop-' + index,
          source: String(index),
          target: String(index),
          weight: index + 1,
        },
      })),
    },
    style: [
      {
        selector: 'node',
        style: { width: 'data(width)', height: 49, shape: 'bottom-round-rectangle' },
      },
      { selector: 'edge', style: { 'curve-style': 'bezier' } },
    ],
  });
  const sizer = createGraphLoopSizer(cy);
  try {
    sizer.update();
    cy.edges().forEach((edge) => {
      const node = edge.source();
      const radius = Math.hypot(node.outerWidth(), node.outerHeight()) / 2;
      expect(
        Number.parseFloat(String(edge.style('control-point-step-size'))) * 1.4,
      ).toBeGreaterThan(radius);
      expect(edge.source().id()).toBe(edge.target().id());
    });
    expect(cy.edges().map((edge) => Number(edge.data('weight')))).toEqual([1, 2, 3]);
    const [first] = cy.edges();
    const before = String(first.style('control-point-step-size'));
    sizer.update();
    expect(first.style('control-point-step-size')).toBe(before);
    first.source().style('width', 800);
    sizer.update();
    expect(Number.parseFloat(String(first.style('control-point-step-size'))) * 1.4).toBeGreaterThan(
      400,
    );
    first.source().style('width', 20);
    sizer.update();
    expect(Number.parseFloat(String(first.style('control-point-step-size')))).toBeLessThan(
      Number.parseFloat(before),
    );
    sizer.reset();
    expect(first.style('control-point-step-size')).toBe('40px');
  } finally {
    cy.destroy();
  }
});

test('preserves larger configured loops and leaves ordinary edges unchanged', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    elements: [
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      { data: { id: 'loop', source: 'a', target: 'a' } },
      { data: { id: 'ordinary', source: 'a', target: 'b' } },
    ],
    style: [
      {
        selector: 'edge',
        style: {
          'curve-style': 'unbundled-bezier',
          'control-point-step-size': 200,
          'control-point-distances': 220,
        },
      },
    ],
  });
  try {
    createGraphLoopSizer(cy).update();
    expect(cy.getElementById('loop').style('control-point-distances')).toBe('220px');
    expect(cy.getElementById('ordinary').style('control-point-step-size')).toBe('200px');
    expect(cy.getElementById('ordinary').style('control-point-distances')).toBe('220px');
  } finally {
    cy.destroy();
  }
});
