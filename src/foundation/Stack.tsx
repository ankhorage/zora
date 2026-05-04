import { Stack as SurfaceStack, type StackProps as SurfaceStackProps } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface StackProps extends ZoraBaseProps, Omit<SurfaceStackProps, 'mode' | 'themeId'> {}

function StackInner({ themeId: _themeId, mode: _mode, ...props }: StackProps) {
  return <SurfaceStack {...props} />;
}

export const Stack = withZoraThemeScope(StackInner);
