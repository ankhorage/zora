import { Show as SurfaceShow, type ShowProps as SurfaceShowProps } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface ShowProps extends ZoraBaseProps, Omit<SurfaceShowProps, 'mode' | 'themeId'> {}

function ShowInner({ themeId: _themeId, mode: _mode, ...props }: ShowProps) {
  return <SurfaceShow {...props} />;
}

/***
 * Conditionally renders children for responsive display and breakpoint-based visibility.
 *
 
 */
export const Show = withZoraThemeScope(ShowInner);
