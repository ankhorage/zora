/*** Return whether one completed layout still owns the initial automatic viewport fit. */
export function shouldFitGraphAfterLayout(ready: boolean): boolean {
  return !ready;
}
