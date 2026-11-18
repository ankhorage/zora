import type {
  FlowCanvasProps,
  FlowConnectionRejection,
  FlowNodeData,
  FlowPort,
  FlowPortAddress,
  FlowViewport,
} from '../../../types/flow';

/** Create deterministic controlled-flow interaction callbacks without retaining editor state. */
export function createFlowEditorController(props: FlowCanvasProps) {
  const selectNode = (nodeId: string) => {
    if (props.readOnly || props.nodes.find((node) => node.id === nodeId)?.disabled) return;
    props.onNodeSelectionChange?.([nodeId]);
  };
  const moveNode = (nodeId: string, delta: { readonly x: number; readonly y: number }) => {
    if (props.readOnly) return;
    const node = props.nodes.find((candidate) => candidate.id === nodeId);
    if (!node || node.disabled) return;
    props.onNodesMove?.(
      props.nodes.map((candidate) =>
        candidate.id === nodeId
          ? { ...candidate, position: movePosition(candidate, delta) }
          : candidate,
      ),
    );
  };
  const setViewport = (viewport: FlowViewport) => props.onViewportChange?.(viewport);
  const connect = (source: FlowPortAddress, target: FlowPortAddress) => {
    const rejection = connectionRejection(props.nodes, source, target);
    if (props.readOnly || rejection) return rejection;
    props.onConnect?.(source, target);
    return undefined;
  };
  /*** Deliver a controlled deletion request for the currently enabled nodes. */
  const deleteNodes = (nodeIds: readonly string[]) => {
    if (props.readOnly || nodeIds.length === 0) return;
    const enabledNodeIds = nodeIds.filter((nodeId) => {
      const node = props.nodes.find((candidate) => candidate.id === nodeId);
      return node !== undefined && !node.disabled;
    });
    if (enabledNodeIds.length > 0) props.onNodesDelete?.(enabledNodeIds);
  };

  return { connect, deleteNodes, moveNode, selectNode, setViewport };
}

/** Move only the caller-owned coordinate of a node. */
function movePosition(
  node: FlowNodeData,
  delta: { readonly x: number; readonly y: number },
): FlowNodeData['position'] {
  return { x: node.position.x + delta.x, y: node.position.y + delta.y };
}

/** Validates a connection at the Canvas boundary without introducing workflow-engine ownership. */
function connectionRejection(
  nodes: readonly FlowNodeData[],
  source: FlowPortAddress,
  target: FlowPortAddress,
): FlowConnectionRejection | undefined {
  if (source.nodeId === target.nodeId) return 'connection_requires_distinct_nodes';
  const sourcePort = findPort(nodes, source);
  const targetPort = findPort(nodes, target);
  if (sourcePort?.direction !== 'output' || targetPort?.direction !== 'input') {
    return 'connection_requires_output_to_input';
  }
  if (sourcePort.disabled || targetPort.disabled) return 'connection_targets_disabled_port';
  return compatibleDataSchemas(sourcePort.data, targetPort.data)
    ? undefined
    : 'connection_types_incompatible';
}

/** Compares only portable schema references or primitive shapes available to the presentation layer. */
function compatibleDataSchemas(source: FlowPort['data'], target: FlowPort['data']): boolean {
  const sourceReference = source?.schemaRef?.id ?? source?.schema?.ref?.id;
  const targetReference = target?.schemaRef?.id ?? target?.schema?.ref?.id;
  if (sourceReference && targetReference) return sourceReference === targetReference;
  if (sourceReference || targetReference) return false;
  const sourceTypes = schemaTypes(source?.schema?.type);
  const targetTypes = schemaTypes(target?.schema?.type);
  if (sourceTypes.length === 0 || targetTypes.length === 0) return true;
  return sourceTypes.some((type) => targetTypes.includes(type));
}

/** Normalizes a Contracts schema's primitive type union before comparing its declared alternatives. */
function schemaTypes(type: unknown): readonly string[] {
  if (typeof type === 'string') return [type];
  return Array.isArray(type) && type.every((candidate) => typeof candidate === 'string')
    ? type
    : [];
}

/** Locate one port through its public address. */
function findPort(nodes: readonly FlowNodeData[], address: FlowPortAddress): FlowPort | undefined {
  return nodes
    .find((node) => node.id === address.nodeId)
    ?.ports.find((port) => port.id === address.portId);
}
