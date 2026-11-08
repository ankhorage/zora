import type { GraphViewEdge, GraphViewNode } from '../../../../../types/graph-view';
import type { GraphRuntimeUpdate } from '../../../../../types/graphViewRuntime';

/***
 * Keep selection and hover class updates from relayouting a node between native pointer presses.
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
      const next = current.at(index);
      return (
        node.id === next?.id &&
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
      const next = current.at(index);
      return (
        edge.source === next?.source &&
        edge.id === next.id &&
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
  const previousEntries = Object.entries(previous);
  const currentEntries = new Map(Object.entries(current));
  return (
    previousEntries.length === currentEntries.size &&
    previousEntries.every(
      ([key, value]) => currentEntries.has(key) && Object.is(value, currentEntries.get(key)),
    )
  );
}
