import type { Graph, GraphId } from '@ankhorage/graph';

import type {
  GraphViewCanonicalEdgeData,
  GraphViewCanonicalNodeData,
  GraphViewEdge,
  GraphViewInput,
  GraphViewNode,
  ResolvedGraphViewProps,
} from '../../../../../types/graph-view';

/*** Resolve either supported public GraphView input into the existing renderer element contract. */
export function resolveGraphViewProps(props: GraphViewInput): ResolvedGraphViewProps {
  if (!('graph' in props) || props.graph === undefined) return props;

  const { graph, ...presentation } = props;
  return { ...presentation, ...projectCanonicalGraph(graph) };
}

/*** Project canonical graph identity and payloads without placing presentation state in the domain. */
export function projectCanonicalGraph(
  graph: Graph<unknown, unknown, GraphId, GraphId>,
): Pick<ResolvedGraphViewProps, 'nodes' | 'edges'> {
  assertDistinctProjectedElementIds(graph);
  const nodes = graph.nodes
    .map((canonicalNode): GraphViewNode => ({
      data: { canonicalNode } satisfies GraphViewCanonicalNodeData,
      id: String(canonicalNode.id),
    }))
    .sort(compareGraphViewNodes);
  const nodeIds = new Set(nodes.map(({ id }) => id));
  const edges = graph.edges
    .filter((edge) => nodeIds.has(String(edge.source)) && nodeIds.has(String(edge.target)))
    .map((canonicalEdge): GraphViewEdge => ({
      data: { canonicalEdge } satisfies GraphViewCanonicalEdgeData,
      id: String(canonicalEdge.id),
      source: String(canonicalEdge.source),
      target: String(canonicalEdge.target),
    }))
    .sort(compareGraphViewEdges);

  return { nodes, edges };
}

/*** Reject canonical IDs that cannot coexist in Cytoscape's shared string identifier space. */
function assertDistinctProjectedElementIds(graph: Graph<unknown, unknown, GraphId, GraphId>): void {
  const projectedIds = [...graph.nodes, ...graph.edges].map(({ id }) => String(id));
  if (new Set(projectedIds).size !== projectedIds.length) {
    throw new Error('Canonical graph IDs collide after GraphView string projection.');
  }
}

/*** Sort projected nodes by their stable renderer identity. */
function compareGraphViewNodes(left: GraphViewNode, right: GraphViewNode): number {
  return compareProjectedIds(left.id, right.id);
}

/*** Sort projected edges by identity, then endpoints for deterministic reconciliation. */
function compareGraphViewEdges(left: GraphViewEdge, right: GraphViewEdge): number {
  return (
    compareProjectedIds(left.id ?? '', right.id ?? '') ||
    compareProjectedIds(left.source, right.source) ||
    compareProjectedIds(left.target, right.target)
  );
}

/*** Compare projected identifiers without locale-dependent ordering. */
function compareProjectedIds(left: string, right: string): number {
  if (left < right) return -1;
  return left > right ? 1 : 0;
}
