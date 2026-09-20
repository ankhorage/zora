import { describe, expect, it } from 'bun:test';
import cytoscape from 'cytoscape';

import { syncGraphElements } from './syncGraphElements';

describe('syncGraphElements', () => {
  it('updates highlights without replacing positioned or selected nodes', () => {
    const cy = cytoscape({ headless: true });
    syncGraphElements(cy, [{ id: 'a' }, { id: 'b' }], [{ source: 'a', target: 'b' }]);
    const node = cy.getElementById('a');
    node.position({ x: 120, y: 80 }).select();
    syncGraphElements(
      cy,
      [{ id: 'a', classes: 'highlight', data: { color: 'red' } }, { id: 'b' }],
      [{ source: 'a', target: 'b' }],
    );
    expect(cy.getElementById('a').position()).toEqual({ x: 120, y: 80 });
    expect(cy.getElementById('a').selected()).toBe(true);
    expect(node.hasClass('highlight')).toBe(true);
    syncGraphElements(cy, [{ id: 'a' }, { id: 'b' }], [{ source: 'a', target: 'b' }]);
    expect(node.hasClass('highlight')).toBe(false);
    expect(node.data('color')).toBeUndefined();
    cy.destroy();
  });

  it('moves retained nodes out of removed compound parents and removes obsolete edges', () => {
    const cy = cytoscape({ headless: true });
    syncGraphElements(
      cy,
      [{ id: 'parent' }, { id: 'a', parentId: 'parent' }, { id: 'b' }],
      [{ source: 'a', target: 'b' }],
    );
    syncGraphElements(cy, [{ id: 'a' }, { id: 'c' }], [{ source: 'a', target: 'c' }]);
    expect(cy.nodes().map((node) => node.id())).toEqual(['a', 'c']);
    expect(cy.getElementById('a').parent().empty()).toBe(true);
    expect(cy.edges().map((edge) => edge.target().id())).toEqual(['c']);
    cy.destroy();
  });
});
