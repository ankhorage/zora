import {
  Inline as SurfaceInline,
  type InlineProps as SurfaceInlineProps,
} from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../theme/withZoraThemeScope';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface InlineProps extends ZoraBaseProps, Omit<SurfaceInlineProps, 'mode' | 'themeId'> {}

function InlineInner({ themeId: _themeId, mode: _mode, ...props }: InlineProps) {
  return <SurfaceInline {...props} />;
}

export const Inline = withZoraThemeScope(InlineInner);
