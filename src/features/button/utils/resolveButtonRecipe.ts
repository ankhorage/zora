import type { ButtonProps as SurfaceButtonProps } from '@ankhorage/surface';

import type { ZoraButtonVariant } from '../../../types/button';
import type { ZoraControlSize } from '../../../types/control';
import type { ZoraColor } from '../../../types/theme';

export function resolveButtonRecipe({
  color = 'primary',
  variant = 'solid',
  size = 'l',
}: {
  color?: ZoraColor;
  variant?: ZoraButtonVariant;
  size?: ZoraControlSize;
}): Pick<SurfaceButtonProps, 'size' | 'color' | 'variant'> {
  return { size, color, variant };
}
