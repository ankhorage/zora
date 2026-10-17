import React from 'react';

import type { ScrollGestureLock } from '../../../../types/layout';

/*** Carries the nearest ZORA ScrollView gesture lock to descendant gesture surfaces. */
export const ScrollGestureLockContext = React.createContext<ScrollGestureLock | undefined>(
  undefined,
);
