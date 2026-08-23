import { Icon as SurfaceIcon, type IconProps as SurfaceIconProps } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type IconProps = ZoraBaseProps & SurfaceIconProps;

function IconInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: IconProps) {
  return <SurfaceIcon {...props} />;
}

/***
 * Renders an icon from a configured icon provider with theme-aware defaults.
 */
export const Icon = withZoraThemeScope(IconInner);
