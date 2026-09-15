import { ScrollView as SurfaceScrollView } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { ScrollViewProps } from '../../../../types/layout';

/*** Adapts the token-aware Surface ScrollView primitive to ZORA theme scope. */
export const ScrollView = withZoraThemeScope(ScrollViewInner);

/*** Forwards ZORA scrolling props to the published Surface ScrollView boundary. */
function ScrollViewInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: ScrollViewProps) {
  return <SurfaceScrollView {...props} />;
}
