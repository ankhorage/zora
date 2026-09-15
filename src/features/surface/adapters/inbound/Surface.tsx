import { Surface as SurfaceSurface } from '@ankhorage/surface';
import React from 'react';

import type { SurfaceProps } from '../../../../types/surface';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

/*** Adapts the themed Surface Surface primitive to ZORA scope and interaction props. */
export const Surface = withZoraThemeScope(SurfaceInner);

/*** Forwards presentation props to the published Surface boundary. */
function SurfaceInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: SurfaceProps) {
  return <SurfaceSurface {...props} />;
}
