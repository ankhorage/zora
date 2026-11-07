/*** Fit initial, topology, or layout-algorithm changes while preserving viewport intent otherwise. */
export function shouldFitGraphAfterLayout(
  ready: boolean,
  topologyChanged: boolean,
  layoutChanged: boolean,
): boolean {
  return !ready || topologyChanged || layoutChanged;
}
