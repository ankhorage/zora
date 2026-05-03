import type { ButtonIconSpec, ButtonProps as SurfaceButtonProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraControlSize, ZoraEmphasis, ZoraTone } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ButtonProps
  extends ZoraBaseProps, Omit<SurfaceButtonProps, 'children' | 'size' | 'tone' | 'variant'> {
  children?: React.ReactNode;
  tone?: ZoraTone;
  emphasis?: ZoraEmphasis;
  size?: ZoraControlSize;
  leadingIcon?: ButtonIconSpec;
  trailingIcon?: ButtonIconSpec;
}
