import {
  Surface as SurfaceSurface,
  type SurfaceProps as SurfaceSurfaceProps,
  type SurfaceVariant,
} from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export type { SurfaceVariant };

export interface SurfaceProps
  extends ZoraBaseProps, Omit<SurfaceSurfaceProps, 'mode' | 'themeId'> {}

function SurfaceInner({ themeId: _themeId, mode: _mode, ...props }: SurfaceProps) {
  return <SurfaceSurface {...props} />;
}

export const Surface = withZoraThemeScope(SurfaceInner);
