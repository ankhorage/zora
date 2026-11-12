import type { FlowNodeData, FlowPoint, FlowPortAddress } from '../../../types/flow';

const FLOW_NODE_WIDTH = 224;
const FLOW_PORT_ROW_HEIGHT = 36;
const FLOW_NODE_HEADER_HEIGHT = 56;
const FLOW_PORT_INSET = 12;

/*** Resolves the stable canvas coordinate at the center of a rendered flow port. */
export function getFlowPortAnchor(
  nodes: readonly FlowNodeData[],
  address: FlowPortAddress,
): FlowPoint | undefined {
  const node = nodes.find((candidate) => candidate.id === address.nodeId);
  const portIndex = node?.ports.findIndex((port) => port.id === address.portId) ?? -1;
  const port = node?.ports.find((candidate) => candidate.id === address.portId);
  if (!node || !port) return undefined;
  return {
    x:
      node.position.x +
      (port.direction === 'input' ? FLOW_PORT_INSET : FLOW_NODE_WIDTH - FLOW_PORT_INSET),
    y: node.position.y + FLOW_NODE_HEADER_HEIGHT + portIndex * FLOW_PORT_ROW_HEIGHT + 16,
  };
}

/*** Publishes the fixed node width used by port and edge rendering. */
export function getFlowNodeWidth() {
  return FLOW_NODE_WIDTH;
}

/*** Publishes the minimum node height needed for its independently focusable ports. */
export function getFlowNodeHeight(node: FlowNodeData) {
  return FLOW_NODE_HEADER_HEIGHT + Math.max(node.ports.length, 1) * FLOW_PORT_ROW_HEIGHT + 12;
}
