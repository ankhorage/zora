import { Grid as SurfaceGrid } from '@ankhorage/surface';
import React from 'react';

import type { GridProps } from '../../../../types/layout';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

/*** Adapts the themed Surface Grid primitive to ZORA scope and interaction props. */
export const Grid = withZoraThemeScope(GridInner);

/*** Forwards presentation props to the published Surface boundary. */
function GridInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: GridProps) {
  return <SurfaceGrid {...props} />;
}
