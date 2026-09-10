import { Surface as SurfaceSurface } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { SurfaceProps } from '../../../../types/surface';

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
