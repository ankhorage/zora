import type { BadgeProps as SurfaceBadgeProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { ZoraControlSize } from './control';
import type { ZoraColor } from './theme';

export type ZoraBadgeVariant = NonNullable<SurfaceBadgeProps['variant']>;

export interface BadgeProps
  extends
    ZoraBaseProps,
    Omit<SurfaceBadgeProps, 'content' | 'size' | 'color' | 'variant' | 'mode' | 'themeId'> {
  children?: React.ReactNode;
  color?: ZoraColor;
  variant?: ZoraBadgeVariant;
  size?: ZoraControlSize;
}
