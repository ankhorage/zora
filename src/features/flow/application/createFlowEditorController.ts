import type {
  FlowCanvasProps,
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
    if (props.readOnly || !isCompatibleConnection(props.nodes, source, target)) return;
    props.onConnect?.(source, target);
  };

  return { connect, moveNode, selectNode, setViewport };
}

/** Move only the caller-owned coordinate of a node. */
function movePosition(
  node: FlowNodeData,
  delta: { readonly x: number; readonly y: number },
): FlowNodeData['position'] {
  return { x: node.position.x + delta.x, y: node.position.y + delta.y };
}

/** Accept only output-to-input connections between distinct, enabled typed ports. */
function isCompatibleConnection(
  nodes: readonly FlowNodeData[],
  source: FlowPortAddress,
  target: FlowPortAddress,
): boolean {
  if (source.nodeId === target.nodeId) return false;
  const sourcePort = findPort(nodes, source);
  const targetPort = findPort(nodes, target);
  return (
    sourcePort?.direction === 'output' &&
    targetPort?.direction === 'input' &&
    !sourcePort.disabled &&
    !targetPort.disabled
  );
}

/** Locate one port through its public address. */
function findPort(nodes: readonly FlowNodeData[], address: FlowPortAddress): FlowPort | undefined {
  return nodes
    .find((node) => node.id === address.nodeId)
    ?.ports.find((port) => port.id === address.portId);
}
