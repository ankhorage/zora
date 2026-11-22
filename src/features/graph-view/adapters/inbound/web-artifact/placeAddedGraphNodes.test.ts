import { expect, test } from 'bun:test';
import cytoscape from 'cytoscape';

import { placeAddedGraphNodes } from './placeAddedGraphNodes';

test('positions added compound descendants at the visible viewport when no retained leaf remains', () => {
  const cy = cytoscape({
    headless: true,
    elements: [
      { data: { id: 'src' } },
      { data: { id: 'src.features', parent: 'src' } },
      { data: { id: 'src.features.nested', parent: 'src.features' } },
    ],
  });
  try {
    cy.extent = () => ({ x1: 100, x2: 300, y1: 40, y2: 200, w: 200, h: 160 });

    placeAddedGraphNodes(
      cy,
      [{ id: 'src' }],
      [
        { id: 'src' },
        { id: 'src.features', parentId: 'src' },
        { id: 'src.features.nested', parentId: 'src.features' },
      ],
    );

    expect(cy.getElementById('src.features').isParent()).toBe(true);
    expect(cy.getElementById('src.features.nested').position()).toEqual({ x: 200, y: 120 });
  } finally {
    cy.destroy();
  }
});
