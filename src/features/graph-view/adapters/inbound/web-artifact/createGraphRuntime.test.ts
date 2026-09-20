import './createGraphRuntime';

import { expect, test } from 'bun:test';
import cytoscape from 'cytoscape';

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
