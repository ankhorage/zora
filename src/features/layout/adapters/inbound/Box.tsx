import { Box as SurfaceBox } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { BoxProps } from '../../../../types/layout';

/*** Adapts the themed Surface Box primitive to ZORA scope and interaction props. */
export const Box = withZoraThemeScope(BoxInner);

/*** Forwards presentation props to the published Surface boundary. */
function BoxInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: BoxProps) {
  return <SurfaceBox {...props} />;
}
