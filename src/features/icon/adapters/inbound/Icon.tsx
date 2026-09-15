import { Icon as SurfaceIcon } from '@ankhorage/surface';
import React from 'react';

import type { IconProps } from '../../../../types/icon';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

/*** Adapts the themed Surface Icon primitive to ZORA scope and interaction props. */
export const Icon = withZoraThemeScope(IconInner);

/*** Forwards presentation props to the published Surface boundary. */
function IconInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: IconProps) {
  return <SurfaceIcon {...props} />;
}
