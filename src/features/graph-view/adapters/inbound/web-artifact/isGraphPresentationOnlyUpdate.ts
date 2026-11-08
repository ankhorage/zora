import type { GraphViewEdge, GraphViewNode } from '../../../../../types/graph-view';
import type { GraphRuntimeUpdate } from '../../../../../types/graphViewRuntime';

/***
 * Keep selection and hover class updates from relaying out a node between native pointer presses.
 * A changed label, data field, topology, stylesheet or layout policy remains eligible for layout.
 * Compare immutable graph values rather than consumer array identities.
 */
export function isGraphPresentationOnlyUpdate(
  previous: GraphRuntimeUpdate | null,
  input: GraphRuntimeUpdate,
): boolean {
  if (
    previous === null ||
    previous.styleRules !== input.styleRules ||
    previous.richNodeRendering !== input.richNodeRendering ||
    previous.sizeNodesToLabels !== input.sizeNodesToLabels
  ) {
    return false;
  }
  return (
    sameNodeGeometryInputs(previous.nodes, input.nodes) &&
    sameEdgeGeometryInputs(previous.edges, input.edges)
  );
}

/*** Compare layout-relevant node metadata while deliberately ignoring transient classes. */
function sameNodeGeometryInputs(
  previous: readonly GraphViewNode[],
  current: readonly GraphViewNode[],
): boolean {
  return (
    previous.length === current.length &&
    previous.every((node, index) => {
      const next = current[index];
      return (
        next !== undefined &&
        node.id === next.id &&
        node.parentId === next.parentId &&
        node.label === next.label &&
        sameData(node.data, next.data)
      );
    })
  );
}

/*** Ignore edge highlight classes but retain changes to data and graph endpoints. */
function sameEdgeGeometryInputs(
  previous: readonly GraphViewEdge[],
  current: readonly GraphViewEdge[],
): boolean {
  return (
    previous.length === current.length &&
    previous.every((edge, index) => {
      const next = current[index];
      return (
        next !== undefined &&
        edge.id === next.id &&
        edge.source === next.source &&
        edge.target === next.target &&
        sameData(edge.data, next.data)
      );
    })
  );
}

/*** Treat separately materialized but shallow-equal public graph data as the same geometry input. */
function sameData(
  previous: Readonly<Record<string, unknown>> | undefined,
  current: Readonly<Record<string, unknown>> | undefined,
): boolean {
  if (previous === current) return true;
  if (previous === undefined || current === undefined) return false;
  const keys = Object.keys(previous);
  return (
    keys.length === Object.keys(current).length &&
    keys.every((key) => Object.hasOwn(current, key) && Object.is(previous[key], current[key]))
  );
}
