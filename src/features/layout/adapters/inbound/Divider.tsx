import { Divider as SurfaceDivider } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { DividerProps } from '../../../../types/layout';

/*** Adapts the themed Surface Divider primitive to ZORA scope and interaction props. */
export const Divider = withZoraThemeScope(DividerInner);

/*** Forwards presentation props to the published Surface boundary. */
function DividerInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: DividerProps) {
  return <SurfaceDivider {...props} />;
}
