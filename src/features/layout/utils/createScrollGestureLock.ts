import type { ScrollGestureLock } from '../../../types/layout';

/*** Creates a lock that reports each held gesture to its scroll container and also suspends every ancestor container. */
export function createScrollGestureLock(
  parent: ScrollGestureLock,
  onActiveGesturesChange: (delta: 1 | -1) => void,
): ScrollGestureLock {
  return {
    acquire: () => {
      const releaseParent = parent.acquire();
      let released = false;
      onActiveGesturesChange(1);
      return () => {
        if (released) return;
        released = true;
        onActiveGesturesChange(-1);
        releaseParent();
      };
    },
  };
}
