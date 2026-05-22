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

/***
 * Renders a themed visual separator between content sections.
 *
 * @readme
 */
export const Divider = withZoraThemeScope(DividerInner);
