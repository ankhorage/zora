import type { ButtonIconSpec, ButtonProps as SurfaceButtonProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { ZoraControlSize } from './control';
import type { ZoraColor } from './theme';

export type ZoraButtonVariant = NonNullable<SurfaceButtonProps['variant']>;

export interface ButtonProps
  extends ZoraBaseProps, Omit<SurfaceButtonProps, 'children' | 'size' | 'color' | 'variant'> {
  children?: React.ReactNode;
  color?: ZoraColor;
  variant?: ZoraButtonVariant;
  size?: ZoraControlSize;
  leadingIcon?: ButtonIconSpec;
  trailingIcon?: ButtonIconSpec;
}
