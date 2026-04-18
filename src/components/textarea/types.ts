import type { ButtonIconSpec, TextareaProps as SurfaceTextareaProps } from '@ankhorage/surface';

import type { ZoraControlSize } from '../../internal/recipes';

export interface TextareaProps extends Omit<
  SurfaceTextareaProps,
  'leadingAccessory' | 'size' | 'trailingAccessory'
> {
  size?: ZoraControlSize;
  leadingIcon?: ButtonIconSpec;
  trailingIcon?: ButtonIconSpec;
}
