import type { GraphViewEdge, GraphViewNode } from './GraphView';

/*** Identify visible graph membership and hierarchy independently of presentation metadata. */
export function getGraphTopologyKey(
  nodes: readonly GraphViewNode[],
  edges: readonly GraphViewEdge[],
): string {
  return JSON.stringify([
    nodes.map((node) => [node.id, node.parentId ?? null]).sort(),
    edges.map((edge) => [edge.id ?? null, edge.source, edge.target]).sort(),
  ]);
}
