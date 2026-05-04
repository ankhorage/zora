import {
  Divider as SurfaceDivider,
  type DividerProps as SurfaceDividerProps,
} from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface DividerProps
  extends ZoraBaseProps, Omit<SurfaceDividerProps, 'mode' | 'themeId'> {}

function DividerInner({ themeId: _themeId, mode: _mode, ...props }: DividerProps) {
  return <SurfaceDivider {...props} />;
}

export const Divider = withZoraThemeScope(DividerInner);
