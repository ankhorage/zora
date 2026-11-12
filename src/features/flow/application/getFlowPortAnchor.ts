import type { FlowPoint, FlowPortAddress } from '../../../types/flow';

/*** Creates the stable local key used for one rendered port measurement. */
export function getFlowPortAnchorKey(address: FlowPortAddress) {
  return JSON.stringify([address.nodeId, address.portId]);
}

/*** Resolves the stable canvas coordinate measured at the center of a rendered flow port. */
export function getFlowPortAnchor(
  anchors: ReadonlyMap<string, FlowPoint>,
  address: FlowPortAddress,
): FlowPoint | undefined {
  return anchors.get(getFlowPortAnchorKey(address));
}
