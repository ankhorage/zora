import type { Core } from 'cytoscape';

/***
 * Optimize settled layout spacing uniformly until measured node and label bounds clear.
 * Compound containment is intentional; sibling and unrelated compound intersections are not.
 * @performance At most eight synchronous trials and 200,000 pair checks per trial. No layout
 * algorithm reruns, no work on zoom, and no intermediate frame is painted. Large, locked, or
 * non-uniformly overlapping views retain their original positions.
 */
export function compactGraphSpacing(cy: Core, spacingFactor: number): number {
  const leaves = cy.nodes(':childless');
  if (leaves.length < 2 || cy.nodes().length > 2000 || leaves.filter(':locked').length > 0)
    return spacingFactor;
  const ancestors = new Map(
    cy.nodes().map((node) => [node.id(), new Set(node.ancestors().map((parent) => parent.id()))]),
  );
  const positions = new Map(leaves.map((node) => [node.id(), { ...node.position() }]));
  const bounds = leaves.boundingBox();
  const center = { x: (bounds.x1 + bounds.x2) / 2, y: (bounds.y1 + bounds.y2) / 2 };
  if (hasCollisions(cy, ancestors))
    return expandGraphSpacing(cy, ancestors, center, positions, spacingFactor);
  return compressGraphSpacing(cy, ancestors, center, positions, spacingFactor);
}

/*** Compress a collision-free settled layout to its smallest measured clearance. */
function compressGraphSpacing(
  cy: Core,
  ancestors: ReadonlyMap<string, ReadonlySet<string>>,
  center: { x: number; y: number },
  positions: ReadonlyMap<string, { x: number; y: number }>,
  spacingFactor: number,
): number {
  const search = { low: Math.min(1, 0.1 / spacingFactor), high: 1 };
  for (const attempt of Array.from({ length: 8 }, (_, index) => index)) {
    const factor = attempt === 0 ? search.low : (search.low + search.high) / 2;
    applyScale(cy, positions, center, factor);
    if (hasCollisions(cy, ancestors)) search.low = factor;
    else search.high = factor;
    if (search.high === search.low) break;
  }
  applyScale(cy, positions, center, search.high);
  return spacingFactor * search.high;
}

/*** Expand a uniformly cramped layout until measured node and label bounds clear. */
function expandGraphSpacing(
  cy: Core,
  ancestors: ReadonlyMap<string, ReadonlySet<string>>,
  center: { x: number; y: number },
  positions: ReadonlyMap<string, { x: number; y: number }>,
  spacingFactor: number,
): number {
  let low = 1;
  let high = 1;
  let attempts = 0;
  while (attempts < 8) {
    high *= 2;
    attempts += 1;
    applyScale(cy, positions, center, high);
    if (!hasCollisions(cy, ancestors)) break;
    low = high;
  }
  if (hasCollisions(cy, ancestors)) {
    applyScale(cy, positions, center, 1);
    return spacingFactor;
  }
  for (const _attempt of Array.from({ length: 8 - attempts }, (_, index) => index)) {
    const factor = (low + high) / 2;
    applyScale(cy, positions, center, factor);
    if (hasCollisions(cy, ancestors)) low = factor;
    else high = factor;
  }
  applyScale(cy, positions, center, high);
  return spacingFactor * high;
}

/*** Transform leaf centers, preserving ordering, dimensions, compound membership and edge data. */
function applyScale(
  cy: Core,
  positions: ReadonlyMap<string, { x: number; y: number }>,
  center: { x: number; y: number },
  factor: number,
) {
  cy.batch(() => {
    cy.nodes()
      .not(':parent')
      .positions((node) => {
        const original = positions.get(node.id()) ?? node.position();
        return {
          x: center.x + (original.x - center.x) * factor,
          y: center.y + (original.y - center.y) * factor,
        };
      });
  });
}

/*** Sweep measured bounds, ignoring intentional containment and stopping conservatively at budget. */
function hasCollisions(cy: Core, ancestors: ReadonlyMap<string, ReadonlySet<string>>): boolean {
  const boxes = cy
    .nodes()
    .map((node) => ({
      id: node.id(),
      box: node.boundingBox({
        includeLabels: true,
        includeOverlays: false,
        includeUnderlays: false,
      }),
    }))
    .sort((a, b) => a.box.x1 - b.box.x1);
  const budget = { remaining: 200000 };
  for (const [index, first] of boxes.entries()) {
    for (let next = index + 1; next < boxes.length; next += 1) {
      const second = boxes.at(next);
      if (!second) break;
      if (second.box.x1 >= first.box.x2 + 8) break;
      if (--budget.remaining < 0) return true;
      if (ancestors.get(first.id)?.has(second.id) || ancestors.get(second.id)?.has(first.id))
        continue;
      if (first.box.y1 < second.box.y2 + 8 && second.box.y1 < first.box.y2 + 8) return true;
    }
  }
  return false;
}
