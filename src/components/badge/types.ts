import type { BadgeProps as SurfaceBadgeProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBadgeEmphasis, ZoraControlSize, ZoraTone } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface BadgeProps
  extends
    ZoraBaseProps,
    Omit<SurfaceBadgeProps, 'content' | 'size' | 'tone' | 'variant' | 'mode' | 'themeId'> {
  children?: React.ReactNode;
  tone?: ZoraTone;
  emphasis?: ZoraBadgeEmphasis;
  size?: ZoraControlSize;
}
