import type { BadgeProps as SurfaceBadgeProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBadgeVariant, ZoraColor, ZoraControlSize } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface BadgeProps
  extends
    ZoraBaseProps,
    Omit<SurfaceBadgeProps, 'content' | 'size' | 'color' | 'variant' | 'mode' | 'themeId'> {
  children?: React.ReactNode;
  color?: ZoraColor;
  variant?: ZoraBadgeVariant;
  size?: ZoraControlSize;
}
