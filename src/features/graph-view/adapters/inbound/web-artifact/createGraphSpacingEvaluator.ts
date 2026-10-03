import type { Core, NodeSingular } from 'cytoscape';

import type {
  GraphSpacingCandidate,
  GraphSpacingEvaluator,
  GraphSpacingFitOptions,
} from '../../../../../types/graph-view-spacing';

const MAX_PAIR_CHECKS = 200000;

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
  readonly fitBox: Bounds;
  readonly labelBox: Bounds | null;
  readonly visualBox: Bounds;
}

interface GroupGeometry {
  readonly id: string;
  readonly ancestors: ReadonlySet<string>;
  readonly descendantIds: readonly string[];
  readonly insets: Insets;
}

interface ResolvedLeafGeometry {
  readonly id: string;
  readonly ancestors: ReadonlySet<string>;
  readonly fitBox: Bounds;
  readonly labelBox: Bounds | null;
  readonly visualBox: Bounds;
}

interface CollisionBox {
  readonly id: string;
  readonly ancestors: ReadonlySet<string>;
  readonly kind: 'group' | 'label' | 'visual';
  readonly box: Bounds;
}

interface SpacingContext {
  readonly center: Point;
  readonly fitPadding: number;
  readonly leaves: readonly LeafGeometry[];
  readonly groups: readonly GroupGeometry[];
  readonly maxFitZoom: number;
  readonly viewport: { readonly width: number; readonly height: number };
}

/***
 * Snapshot renderer geometry once and expose pure candidate evaluation plus one accepted mutation.
 * Labels and unrelated compound boundaries are hard constraints. Leaf backgrounds report rendered
 * overlap separately so the caller can spend a small visual-overlap budget only for dense graphs.
 */
export function createGraphSpacingEvaluator(
  cy: Core,
  options: GraphSpacingFitOptions = {},
): GraphSpacingEvaluator | null {
  const leaves = cy.nodes(':childless');
  const viewport = { width: cy.width(), height: cy.height() };
  if (leaves.length < 2 || viewport.width <= 0 || viewport.height <= 0) return null;

  const leafBounds = leaves.boundingBox();
  const center = {
    x: (leafBounds.x1 + leafBounds.x2) / 2,
    y: (leafBounds.y1 + leafBounds.y2) / 2,
  };
  const leafGeometry = leaves.map(readLeafGeometry);
  const context: SpacingContext = {
    center,
    fitPadding: Math.max(0, options.fitPadding ?? 50),
    leaves: leafGeometry,
    groups: cy.nodes(':parent').map((node) => readGroupGeometry(node, leafGeometry)),
    maxFitZoom: positiveNumber(options.maxFitZoom, Infinity),
    viewport,
  };

  return {
    evaluate: (factor) => evaluateSpacingCandidate(context, factor),
    apply: (factor) => applyScale(cy, leafGeometry, center, factor),
  };
}

/*** Read immutable leaf geometry while separating label content from decorative node bounds. */
function readLeafGeometry(node: NodeSingular): LeafGeometry {
  const fitBox = readNodeBox(node, true);
  const visualBox = readNodeBox(node, false);
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
    fitBox,
    labelBox: isUsableBox(labelBox) ? labelBox : null,
    visualBox: isUsableBox(visualBox) ? visualBox : fitBox,
  };
}

/*** Read a leaf node box with explicit label participation and no edge/overlay geometry. */
function readNodeBox(node: NodeSingular, includeLabels: boolean): Bounds {
  return node.boundingBox({
    includeNodes: true,
    includeEdges: false,
    includeLabels,
    includeOverlays: false,
    includeUnderlays: false,
  });
}

/*** Capture compound insets so candidate parent bounds follow uniformly shifted descendants. */
function readGroupGeometry(node: NodeSingular, leaves: readonly LeafGeometry[]): GroupGeometry {
  const descendants = leaves.filter((leaf) => leaf.ancestors.has(node.id()));
  const parentBox = readNodeBox(node, true);
  const descendantUnion = unionBounds(descendants.map((leaf) => leaf.fitBox)) ?? parentBox;
  return {
    id: node.id(),
    ancestors: new Set(node.ancestors().map((parent) => parent.id())),
    descendantIds: descendants.map((leaf) => leaf.id),
    insets: {
      left: Math.max(0, descendantUnion.x1 - parentBox.x1),
      right: Math.max(0, parentBox.x2 - descendantUnion.x2),
      top: Math.max(0, descendantUnion.y1 - parentBox.y1),
      bottom: Math.max(0, parentBox.y2 - descendantUnion.y2),
    },
  };
}

/*** Evaluate one uniform spacing factor without mutating Cytoscape or painting intermediate frames. */
function evaluateSpacingCandidate(context: SpacingContext, factor: number): GraphSpacingCandidate {
  const leaves = context.leaves.map((leaf) => resolveLeafGeometry(leaf, context.center, factor));
  const byId = new Map(leaves.map((leaf) => [leaf.id, leaf]));
  const groups = context.groups.flatMap((group) => resolveGroupBox(group, byId));
  const fitBounds = unionBounds([
    ...leaves.map((leaf) => leaf.fitBox),
    ...groups.map((group) => group.box),
  ]);
  const rawFitZoom = fitBounds === undefined ? 1 : getFitZoom(fitBounds, context);
  const effectiveFitZoom = Math.min(rawFitZoom, context.maxFitZoom);
  return {
    effectiveFitZoom,
    ...readCollisionState(createCollisionBoxes(leaves, groups), effectiveFitZoom),
  };
}

/*** Shift one leaf's fixed renderer boxes with its center under uniform radial scaling. */
function resolveLeafGeometry(
  leaf: LeafGeometry,
  center: Point,
  factor: number,
): ResolvedLeafGeometry {
  return {
    id: leaf.id,
    ancestors: leaf.ancestors,
    fitBox: shiftBounds(leaf.fitBox, leaf.position, center, factor),
    labelBox:
      leaf.labelBox === null ? null : shiftBounds(leaf.labelBox, leaf.position, center, factor),
    visualBox: shiftBounds(leaf.visualBox, leaf.position, center, factor),
  };
}

/*** Resolve one compound boundary from shifted descendants plus measured outer insets. */
function resolveGroupBox(
  group: GroupGeometry,
  leaves: ReadonlyMap<string, ResolvedLeafGeometry>,
): readonly CollisionBox[] {
  const descendantBounds = group.descendantIds.flatMap((id) => {
    const leaf = leaves.get(id);
    return leaf === undefined ? [] : [leaf.fitBox];
  });
  const union = unionBounds(descendantBounds);
  return union === undefined
    ? []
    : [
        {
          id: group.id,
          ancestors: group.ancestors,
          kind: 'group',
          box: expandBounds(union, group.insets),
        },
      ];
}

/*** Build collision boxes with semantic labels separate from decorative leaf backgrounds. */
function createCollisionBoxes(
  leaves: readonly ResolvedLeafGeometry[],
  groups: readonly CollisionBox[],
): readonly CollisionBox[] {
  return [
    ...leaves.flatMap((leaf) =>
      leaf.labelBox === null
        ? []
        : [{ id: leaf.id, ancestors: leaf.ancestors, kind: 'label' as const, box: leaf.labelBox }],
    ),
    ...leaves.map((leaf) => ({
      id: leaf.id,
      ancestors: leaf.ancestors,
      kind: 'visual' as const,
      box: leaf.visualBox,
    })),
    ...groups,
  ];
}

/***
 * Sweep collision boxes and separate semantic collisions from decorative background penetration.
 * Pair-budget exhaustion is conservative and therefore treated as a hard collision.
 */
function readCollisionState(
  boxes: readonly CollisionBox[],
  zoom: number,
): Pick<GraphSpacingCandidate, 'hardCollision' | 'renderedBackgroundOverlap'> {
  const sorted = [...boxes].sort((first, second) => first.box.x1 - second.box.x1);
  const budget = { remaining: MAX_PAIR_CHECKS };
  const overlap = { maximum: 0 };
  for (const [index, first] of sorted.entries()) {
    for (let next = index + 1; next < sorted.length; next += 1) {
      const second = sorted.at(next);
      if (second === undefined) break;
      if (second.box.x1 >= first.box.x2) break;
      if (first.id === second.id || isIntentionalContainment(first, second)) continue;
      const penetration = getOverlapPenetration(first.box, second.box);
      if (penetration <= 0) continue;
      budget.remaining -= 1;
      if (budget.remaining < 0) return { hardCollision: true, renderedBackgroundOverlap: Infinity };
      if (first.kind === 'visual' && second.kind === 'visual') {
        overlap.maximum = Math.max(overlap.maximum, penetration * zoom);
        continue;
      }
      return { hardCollision: true, renderedBackgroundOverlap: overlap.maximum };
    }
  }
  return { hardCollision: false, renderedBackgroundOverlap: overlap.maximum };
}

/*** Ignore only true ancestor/descendant containment; siblings remain collision candidates. */
function isIntentionalContainment(first: CollisionBox, second: CollisionBox): boolean {
  return first.ancestors.has(second.id) || second.ancestors.has(first.id);
}

/*** Return the smaller-axis penetration for intersecting rectangles, or zero when disjoint. */
function getOverlapPenetration(first: Bounds, second: Bounds): number {
  const width = Math.min(first.x2, second.x2) - Math.max(first.x1, second.x1);
  const height = Math.min(first.y2, second.y2) - Math.max(first.y1, second.y1);
  return width > 0 && height > 0 ? Math.min(width, height) : 0;
}

/*** Calculate native zoom for fitting candidate node geometry inside the padded viewport. */
function getFitZoom(bounds: Bounds, context: SpacingContext): number {
  const width = context.viewport.width - 2 * context.fitPadding;
  const height = context.viewport.height - 2 * context.fitPadding;
  if (width <= 0 || height <= 0 || bounds.w <= 0 || bounds.h <= 0) return 1;
  return Math.min(width / bounds.w, height / bounds.h);
}

/*** Shift one fixed renderer box with its leaf center under uniform radial scaling. */
function shiftBounds(box: Bounds, position: Point, center: Point, factor: number): Bounds {
  const dx = (position.x - center.x) * (factor - 1);
  const dy = (position.y - center.y) * (factor - 1);
  return { ...box, x1: box.x1 + dx, y1: box.y1 + dy, x2: box.x2 + dx, y2: box.y2 + dy };
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

/*** Return whether renderer measurement produced a non-empty box. */
function isUsableBox(box: Bounds): boolean {
  return box.w > 0 && box.h > 0;
}

/*** Normalize an optional positive numeric input without allowing NaN or non-positive values. */
function positiveNumber(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) && value > 0 ? value : fallback;
}

/*** Apply the accepted factor once, preserving dimensions, hierarchy, ordering and edge data. */
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
