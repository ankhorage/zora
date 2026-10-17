import React from 'react';

import type { GridInteractionScrollLock } from '../../../../types/grid-interactions';
import { useScrollGestureLock } from '../../../layout/public';
import { createGridInteractionScrollLock } from '../../application/createGridInteractionScrollLock';

/*** Keeps ancestor ZORA scrolling suspended while one native responder gesture owns the surface. */
export function useGridInteractionScrollLock(): GridInteractionScrollLock {
  const scrollLock = useScrollGestureLock();
  const gestureLock = React.useMemo(
    () => createGridInteractionScrollLock(scrollLock),
    [scrollLock],
  );
  React.useEffect(() => gestureLock.release, [gestureLock]);

  return gestureLock;
}
