import {
  Container as SurfaceContainer,
  type ContainerProps as SurfaceContainerProps,
} from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface ContainerProps
  extends ZoraBaseProps, Omit<SurfaceContainerProps, 'mode' | 'themeId'> {}

function ContainerInner({ themeId: _themeId, mode: _mode, ...props }: ContainerProps) {
  return <SurfaceContainer {...props} />;
}

export const Container = withZoraThemeScope(ContainerInner);
