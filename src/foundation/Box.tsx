import { Box as SurfaceBox, type BoxProps as SurfaceBoxProps } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface BoxProps extends ZoraBaseProps, Omit<SurfaceBoxProps, 'mode' | 'themeId'> {}

function BoxInner({ themeId: _themeId, mode: _mode, ...props }: BoxProps) {
  return <SurfaceBox {...props} />;
}

export const Box = withZoraThemeScope(BoxInner);
