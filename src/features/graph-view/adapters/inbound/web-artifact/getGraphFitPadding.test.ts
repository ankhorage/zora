import { expect, test } from 'bun:test';
import cytoscape from 'cytoscape';

import { getGraphFitPadding } from './getGraphFitPadding';

test('keeps requested padding only while the canvas retains graph space', () => {
  const cy = cytoscape({ headless: true });
  cy.width = () => 800;
  cy.height = () => 600;
  try {
    expect(getGraphFitPadding(cy, 50)).toBe(50);

    cy.width = () => 38;
    expect(getGraphFitPadding(cy, 50)).toBe(9.5);
  } finally {
    cy.destroy();
  }
});

test('rejects unusable canvas dimensions and negative padding', () => {
  const cy = cytoscape({ headless: true });
  cy.width = () => 0;
  cy.height = () => 520;
  try {
    expect(getGraphFitPadding(cy, 50)).toBe(0);

    cy.width = () => 800;
    expect(getGraphFitPadding(cy, -50)).toBe(0);
  } finally {
    cy.destroy();
  }
});
