import { Divider as SurfaceDivider } from '@ankhorage/surface';
import React from 'react';

import type { DividerProps } from '../../../../types/layout';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

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
