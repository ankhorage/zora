import { Icon as SurfaceIcon, type IconProps as SurfaceIconProps } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface IconProps extends ZoraBaseProps, SurfaceIconProps {}

function IconInner({ themeId: _themeId, mode: _mode, ...props }: IconProps) {
  return <SurfaceIcon {...props} />;
}

export const Icon = withZoraThemeScope(IconInner);
