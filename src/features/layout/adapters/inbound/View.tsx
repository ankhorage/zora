import { View as SurfaceView } from '@ankhorage/surface';
import React from 'react';

import type { ViewProps } from '../../../../types/layout';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

/*** Adapts the token-aware Surface View primitive to ZORA theme scope. */
export const View = withZoraThemeScope(ViewInner);

/*** Forwards ZORA layout props to the published Surface View boundary. */
function ViewInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: ViewProps) {
  return <SurfaceView {...props} />;
}
