import type { ButtonIconSpec, ButtonProps as SurfaceButtonProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraButtonVariant, ZoraColor, ZoraControlSize } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ButtonProps
  extends ZoraBaseProps, Omit<SurfaceButtonProps, 'children' | 'size' | 'color' | 'variant'> {
  children?: React.ReactNode;
  color?: ZoraColor;
  emphasis?: ZoraButtonVariant;
  size?: ZoraControlSize;
  leadingIcon?: ButtonIconSpec;
  trailingIcon?: ButtonIconSpec;
}
