import React from 'react';

import type { ScrollGestureLock } from '../../../../types/layout';
import { ScrollGestureLockContext } from './ScrollGestureLockContext';

const unlockedScrollGesture: ScrollGestureLock = { acquire: () => () => undefined };

/*** Resolves the nearest ZORA ScrollView lock, or an inert lock when no scroll container exists. */
export function useScrollGestureLock(): ScrollGestureLock {
  return React.useContext(ScrollGestureLockContext) ?? unlockedScrollGesture;
}
