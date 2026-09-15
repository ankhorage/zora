import type { BadgeProps as SurfaceBadgeProps } from '@ankhorage/surface';

import type { ZoraBadgeVariant } from '../../../types/badge';
import type { ZoraControlSize } from '../../../types/control';
import type { ZoraColor } from '../../../types/theme';

export function resolveBadgeRecipe({
  color = 'primary',
  variant = 'soft',
  size = 'm',
}: {
  color?: ZoraColor;
  variant?: ZoraBadgeVariant;
  size?: ZoraControlSize;
}): Pick<SurfaceBadgeProps, 'size' | 'color' | 'variant'> {
  return { size, color, variant };
}
