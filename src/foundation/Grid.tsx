import { Grid as SurfaceGrid, type GridProps as SurfaceGridProps } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface GridProps extends ZoraBaseProps, Omit<SurfaceGridProps, 'mode' | 'themeId'> {}

function GridInner({ themeId: _themeId, mode: _mode, ...props }: GridProps) {
  return <SurfaceGrid {...props} />;
}

export const Grid = withZoraThemeScope(GridInner);
