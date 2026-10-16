import type { GridInteractionScrollLock } from '../../../../types/grid-interactions';

const webScrollLock: GridInteractionScrollLock = {
  acquire: () => undefined,
  release: () => undefined,
};

/*** Leaves browser scrolling to the RNW responder system, which already honors termination requests. */
export function useGridInteractionScrollLock(): GridInteractionScrollLock {
  return webScrollLock;
}
