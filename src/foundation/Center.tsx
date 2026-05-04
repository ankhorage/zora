import {
  Center as SurfaceCenter,
  type CenterProps as SurfaceCenterProps,
} from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface CenterProps extends ZoraBaseProps, Omit<SurfaceCenterProps, 'mode' | 'themeId'> {}

function CenterInner({ themeId: _themeId, mode: _mode, ...props }: CenterProps) {
  return <SurfaceCenter {...props} />;
}

export const Center = withZoraThemeScope(CenterInner);
