import type { BadgeProps as SurfaceBadgeProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBadgeEmphasis, ZoraColor, ZoraControlSize } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface BadgeProps
  extends
    ZoraBaseProps,
    Omit<SurfaceBadgeProps, 'content' | 'size' | 'tone' | 'variant' | 'mode' | 'themeId'> {
  children?: React.ReactNode;
  color?: ZoraColor;
  emphasis?: ZoraBadgeEmphasis;
  size?: ZoraControlSize;
}
