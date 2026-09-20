import type { ElementDefinition } from 'cytoscape';

import type { GraphViewEdge, GraphViewNode } from './GraphView';

/*** Convert plain graph data into renderable Cytoscape elements without impossible compound edges. */
export function createRenderableGraphElements(
  nodes: readonly GraphViewNode[],
  edges: readonly GraphViewEdge[],
): ElementDefinition[] {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const parentById = new Map(
    nodes.flatMap((node) => (node.parentId ? [[node.id, node.parentId] as const] : [])),
  );
  const nodeElements: ElementDefinition[] = nodes.map((node) => ({
    group: 'nodes',
    classes: node.classes ?? '',
    data: {
      ...(node.data ?? {}),
      id: node.id,
      label: node.label ?? node.id,
      parent: node.parentId,
    },
  }));
  const edgeElements = edges.flatMap((edge, index) =>
    createEdgeElement(edge, index, nodeIds, parentById),
  );

  return [...nodeElements, ...edgeElements];
}

/*** Build one edge unless one endpoint owns the other in the compound hierarchy. */
function createEdgeElement(
  edge: GraphViewEdge,
  index: number,
  nodeIds: ReadonlySet<string>,
  parentById: ReadonlyMap<string, string>,
): ElementDefinition[] {
  if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) return [];
  if (isAncestor(edge.source, edge.target, parentById)) return [];
  if (isAncestor(edge.target, edge.source, parentById)) return [];

  return [
    {
      group: 'edges',
      classes: edge.classes ?? '',
      data: {
        ...(edge.data ?? {}),
        id: edge.id ?? `${edge.source}->${edge.target}:${index}`,
        source: edge.source,
        target: edge.target,
      },
    },
  ];
}

/*** Return whether a node appears in another node's compound parent chain. */
function isAncestor(
  possibleAncestor: string,
  nodeId: string,
  parentById: ReadonlyMap<string, string>,
): boolean {
  const visited = new Set<string>();
  let current = parentById.get(nodeId);

  while (current !== undefined && !visited.has(current)) {
    if (current === possibleAncestor) return true;
    visited.add(current);
    current = parentById.get(current);
  }

  return false;
}
