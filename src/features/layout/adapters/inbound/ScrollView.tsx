import { ScrollView as SurfaceScrollView } from '@ankhorage/surface';
import React from 'react';

import type { ScrollViewProps } from '../../../../types/layout';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { createScrollGestureLock } from '../../utils/createScrollGestureLock';
import { ScrollGestureLockContext } from './ScrollGestureLockContext';
import { useScrollGestureLock } from './useScrollGestureLock';

/*** Adapts the token-aware Surface ScrollView primitive to ZORA theme scope. */
export const ScrollView = withZoraThemeScope(ScrollViewInner);

/*** Forwards ZORA scrolling props to the published Surface ScrollView boundary and yields scrolling to active descendant gestures. */
function ScrollViewInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  scrollEnabled = true,
  ...props
}: ScrollViewProps) {
  const parentLock = useScrollGestureLock();
  const [activeGestures, setActiveGestures] = React.useState(0);
  const lock = React.useMemo(
    () =>
      createScrollGestureLock(parentLock, (delta) => setActiveGestures((count) => count + delta)),
    [parentLock],
  );

  return (
    <ScrollGestureLockContext.Provider value={lock}>
      <SurfaceScrollView {...props} scrollEnabled={scrollEnabled && activeGestures === 0} />
    </ScrollGestureLockContext.Provider>
  );
}
