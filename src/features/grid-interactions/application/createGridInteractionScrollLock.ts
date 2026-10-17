import type { GridInteractionScrollLock } from '../../../types/grid-interactions';
import type { ScrollGestureLock } from '../../../types/layout';

/*** Holds at most one ancestor scroll lock for the active responder gesture of an interaction surface. */
export function createGridInteractionScrollLock(
  scrollLock: ScrollGestureLock,
): GridInteractionScrollLock {
  let releaseScrollLock: (() => void) | undefined;
  return {
    acquire: () => {
      releaseScrollLock ??= scrollLock.acquire();
    },
    release: () => {
      releaseScrollLock?.();
      releaseScrollLock = undefined;
    },
  };
}
