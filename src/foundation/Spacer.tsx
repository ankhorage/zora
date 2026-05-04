import {
  Spacer as SurfaceSpacer,
  type SpacerProps as SurfaceSpacerProps,
} from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface SpacerProps extends ZoraBaseProps, Omit<SurfaceSpacerProps, 'mode' | 'themeId'> {}

function SpacerInner({ themeId: _themeId, mode: _mode, ...props }: SpacerProps) {
  return <SurfaceSpacer {...props} />;
}

export const Spacer = withZoraThemeScope(SpacerInner);
