/*** Fit initial or structurally changed graphs while preserving the viewport across spacing updates. */
export function shouldFitGraphAfterLayout(ready: boolean, topologyChanged: boolean): boolean {
  return !ready || topologyChanged;
}
