import { expect, test } from 'bun:test';
import cytoscape from 'cytoscape';

import { getGraphGeometryKey } from './getGraphGeometryKey';
import { syncGraphElements } from './syncGraphElements';

test('ignores styled highlight colors but detects changed layout dimensions', () => {
  const cy = cytoscape({
    headless: true,
    styleEnabled: true,
    style: [
      { selector: 'node', style: { width: 'data(width)', height: 24 } },
      { selector: 'node.highlight', style: { 'background-color': '#ff0000' } },
    ],
  });
  try {
    syncGraphElements(cy, [{ id: 'a', data: { width: 80 } }], []);
    const before = getGraphGeometryKey(cy);
    syncGraphElements(cy, [{ id: 'a', classes: 'highlight', data: { width: 80 } }], []);
    expect(cy.getElementById('a').style('background-color')).toBe('rgb(255,0,0)');
    expect(getGraphGeometryKey(cy)).toBe(before);
    syncGraphElements(cy, [{ id: 'a', classes: 'highlight', data: { width: 160 } }], []);
    expect(getGraphGeometryKey(cy)).not.toBe(before);
  } finally {
    cy.destroy();
  }
});
