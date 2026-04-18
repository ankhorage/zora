import type { ButtonIconSpec, TextInputProps as SurfaceTextInputProps } from '@ankhorage/surface';

import type { ZoraControlSize } from '../../internal/recipes';

export interface InputProps extends Omit<
  SurfaceTextInputProps,
  'leadingAccessory' | 'size' | 'trailingAccessory'
> {
  size?: ZoraControlSize;
  leadingIcon?: ButtonIconSpec;
  trailingIcon?: ButtonIconSpec;
}
