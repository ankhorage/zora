import type { BadgeProps as SurfaceBadgeProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBadgeEmphasis, ZoraControlSize, ZoraTone } from '../../internal/recipes';

export interface BadgeProps extends Omit<
  SurfaceBadgeProps,
  'content' | 'size' | 'tone' | 'variant'
> {
  children?: React.ReactNode;
  tone?: ZoraTone;
  emphasis?: ZoraBadgeEmphasis;
  size?: ZoraControlSize;
}
