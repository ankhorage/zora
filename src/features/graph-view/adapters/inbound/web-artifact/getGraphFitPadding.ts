import type { Core } from 'cytoscape';

/*** Limits requested fit padding so every usable canvas retains graph space. */
export function getGraphFitPadding(cy: Core, padding: number): number {
  const viewportSize = Math.min(cy.width(), cy.height());
  if (!Number.isFinite(viewportSize) || viewportSize <= 0) return 0;

  const requestedPadding = Number.isFinite(padding) ? Math.max(0, padding) : 0;
  return Math.min(requestedPadding, viewportSize / 4);
}
