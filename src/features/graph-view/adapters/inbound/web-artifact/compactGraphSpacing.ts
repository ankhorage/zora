import { findMinimumAcceptedNumber } from '@ankhorage/utility/algorithms';
import type { Core } from 'cytoscape';

const LABEL_OVERLAP_RATIO = 0.12;
const MAX_EXPANSION_ATTEMPTS = 8;
const MAX_NODE_COUNT = 2000;
const MAX_PAIR_CHECKS = 200000;
const SEARCH_ITERATIONS = 8;

/***
 * Optimize settled layout spacing around readable label bounds instead of full node clearance.
 * Compound containment stays intentional while sibling groups retain non-overlapping boundaries.
 * @performance Cytoscape geometry is measured once, then bounded pure numeric trials reuse the
 * immutable snapshot. No layout reruns, zoom work, or intermediate frames are painted.
 */
export function compactGraphSpacing(cy: Core, spacingFactor: number): number {
  const leaves = cy.nodes(':childless');
  if (leaves.length < 2 || cy.nodes().length > MAX_NODE_COUNT || cy.nodes(':locked').length > 0)
    return spacingFactor;

  const bounds = leaves.boundingBox();
  const center = { x: (bounds.x1 + bounds.x2) / 2, y: (bounds.y1 + bounds.y2) / 2 };
  const leafGeometry = leaves.map(readLeafGeometry);
  const groups = cy
    .nodes(':parent')
    .map((node) => readGroupGeometry(node.id(), node.ancestors().map((parent) => parent.id()), node.boundingBox(), leafGeometry));
  const accepts = (factor: number) =>
    !hasUnsafeCollisions(resolveCollisionBoxes(leafGeometry, groups, center, factor));
  const currentAccepted = accepts(1);
  const minimum = currentAccepted ? Math.min(1, 0.1 / spacingFactor) : 1;
  const maximum = currentAccepted ? 1 : findExpansionMaximum(accepts);
  if (maximum === undefined) return spacingFactor;

  const factor = findMinimumAcceptedNumber({
    minimum,
    maximum,
    iterations: SEARCH_ITERATIONS,
    accepts,
  });
  if (factor === undefined) return spacingFactor;

  applyScale(cy, leafGeometry, center, factor);
  return spacingFactor * factor;
}

interface Point {
  readonly x: number;
  readonly y: number;
}

interface Bounds {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly w: number;
  readonly h: number;
}

interface Insets {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
}

interface LeafGeometry {
  readonly id: string;
  readonly ancestors: ReadonlySet<string>;
  readonly position: Point;
  readonly labelBox: Bounds;
  readonly nodeBox: Bounds;
}

interface GroupGeometry {
  readonly id: string;
  readonly ancestors: ReadonlySet<string>;
  readonly descendants: readonly LeafGeometry[];
  readonly insets: Insets;
}

interface CollisionBox {
  readonly id: string;
  readonly ancestors: ReadonlySet<string>;
  readonly kind: 'label' | 'group';
  readonly box: Bounds;
}

/*** Read one leaf's immutable position, hierarchy and renderer-measured label geometry. */
function readLeafGeometry(node: ReturnType<Core['nodes']>[number]): LeafGeometry {
  const nodeBox = node.boundingBox({
    includeLabels: true,
    includeOverlays: false,
    includeUnderlays: false,
  });
  const labelBox = node.boundingBox({
    includeNodes: false,
    includeEdges: false,
    includeLabels: true,
    includeOverlays: false,
    includeUnderlays: false,
  });
  return {
    id: node.id(),
    ancestors: new Set(node.ancestors().map((parent) => parent.id())),
    position: { ...node.position() },
    labelBox: isUsableBox(labelBox) ? labelBox : nodeBox,
    nodeBox,
  };
}

/*** Capture one compound group's descendant geometry and constant renderer-owned outer insets. */
function readGroupGeometry(
  id: string,
  ancestorIds: readonly string[],
  parentBox: Bounds,
  leaves: readonly LeafGeometry[],
): GroupGeometry {
  const descendants = leaves.filter((leaf) => leaf.ancestors.has(id));
  const descendantUnion = unionBounds(descendants.map((leaf) => leaf.nodeBox)) ?? parentBox;
  return {
    id,
    ancestors: new Set(ancestorIds),
    descendants,
    insets: {
      left: Math.max(0, descendantUnion.x1 - parentBox.x1),
      right: Math.max(0, parentBox.x2 - descendantUnion.x2),
      top: Math.max(0, descendantUnion.y1 - parentBox.y1),
      bottom: Math.max(0, parentBox.y2 - descendantUnion.y2),
    },
  };
}

/*** Resolve immutable label and compound boxes for one candidate uniform spacing factor. */
function resolveCollisionBoxes(
  leaves: readonly LeafGeometry[],
  groups: readonly GroupGeometry[],
  center: Point,
  factor: number,
): readonly CollisionBox[] {
  const labels = leaves.map((leaf) => ({
    id: leaf.id,
    ancestors: leaf.ancestors,
    kind: 'label' as const,
    box: shiftBounds(leaf.labelBox, leaf.position, center, factor),
  }));
  const compoundBoxes = groups.flatMap((group) => {
    const descendants = group.descendants.map((leaf) =>
      shiftBounds(leaf.nodeBox, leaf.position, center, factor),
    );
    const union = unionBounds(descendants);
    if (!union) return [];
    return [
      {
        id: group.id,
        ancestors: group.ancestors,
        kind: 'group' as const,
        box: expandBounds(union, group.insets),
      },
    ];
  });
  return [...labels, ...compoundBoxes];
}

/*** Find the first bounded expansion factor that makes the pure geometry snapshot acceptable. */
function findExpansionMaximum(accepts: (factor: number) => boolean): number | undefined {
  return Array.from({ length: MAX_EXPANSION_ATTEMPTS }, (_, index) => 2 ** (index + 1)).find(accepts);
}

/***
 * Sweep resolved boxes by x extent and stop conservatively if the pair-check budget is exhausted.
 * Local loop counters are intentionally mutable on this performance-critical boundary.
 */
function hasUnsafeCollisions(boxes: readonly CollisionBox[]): boolean {
  const sorted = [...boxes].sort((first, second) => first.box.x1 - second.box.x1);
  const budget = { remaining: MAX_PAIR_CHECKS };
  for (const [index, first] of sorted.entries()) {
    for (let next = index + 1; next < sorted.length; next += 1) {
      const second = sorted.at(next);
      if (!second) break;
      if (second.box.x1 >= first.box.x2) break;
      budget.remaining -= 1;
      if (budget.remaining < 0) return true;
      if (isIntentionalContainment(first, second)) continue;
      if (isUnsafeOverlap(first, second)) return true;
    }
  }
  return false;
}

/*** Ignore intentional compound containment while retaining sibling and unrelated separation. */
function isIntentionalContainment(first: CollisionBox, second: CollisionBox): boolean {
  return first.ancestors.has(second.id) || second.ancestors.has(first.id);
}

/*** Permit only a small bounded label-label overlap; every other intersection remains unsafe. */
function isUnsafeOverlap(first: CollisionBox, second: CollisionBox): boolean {
  const overlapWidth = Math.min(first.box.x2, second.box.x2) - Math.max(first.box.x1, second.box.x1);
  const overlapHeight =
    Math.min(first.box.y2, second.box.y2) - Math.max(first.box.y1, second.box.y1);
  if (overlapWidth <= 0 || overlapHeight <= 0) return false;
  if (first.kind !== 'label' || second.kind !== 'label') return true;
  const widthRatio = overlapWidth / Math.min(first.box.w, second.box.w);
  const heightRatio = overlapHeight / Math.min(first.box.h, second.box.h);
  return widthRatio > LABEL_OVERLAP_RATIO && heightRatio > LABEL_OVERLAP_RATIO;
}

/*** Shift one fixed renderer box with its leaf center under uniform radial scaling. */
function shiftBounds(box: Bounds, position: Point, center: Point, factor: number): Bounds {
  const dx = (position.x - center.x) * (factor - 1);
  const dy = (position.y - center.y) * (factor - 1);
  return {
    x1: box.x1 + dx,
    y1: box.y1 + dy,
    x2: box.x2 + dx,
    y2: box.y2 + dy,
    w: box.w,
    h: box.h,
  };
}

/*** Expand a descendant union by the compound renderer's measured outer insets. */
function expandBounds(box: Bounds, insets: Insets): Bounds {
  const x1 = box.x1 - insets.left;
  const y1 = box.y1 - insets.top;
  const x2 = box.x2 + insets.right;
  const y2 = box.y2 + insets.bottom;
  return { x1, y1, x2, y2, w: x2 - x1, h: y2 - y1 };
}

/*** Return the immutable union of measured boxes, or undefined for an empty collection. */
function unionBounds(boxes: readonly Bounds[]): Bounds | undefined {
  if (boxes.length === 0) return undefined;
  const x1 = Math.min(...boxes.map((box) => box.x1));
  const y1 = Math.min(...boxes.map((box) => box.y1));
  const x2 = Math.max(...boxes.map((box) => box.x2));
  const y2 = Math.max(...boxes.map((box) => box.y2));
  return { x1, y1, x2, y2, w: x2 - x1, h: y2 - y1 };
}

/*** Return whether renderer measurement produced a non-empty label box. */
function isUsableBox(box: Bounds): boolean {
  return box.w > 0 && box.h > 0;
}

/*** Apply the accepted factor once, preserving node dimensions, hierarchy, ordering and edge data. */
function applyScale(
  cy: Core,
  leaves: readonly LeafGeometry[],
  center: Point,
  factor: number,
): void {
  const positions = new Map(leaves.map((leaf) => [leaf.id, leaf.position]));
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
