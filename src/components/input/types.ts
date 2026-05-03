import type * as Surface from '@ankhorage/surface';

import type { ZoraControlSize } from '../../internal/recipes';

export interface InputProps extends Omit<
  Surface.TextInputProps,
  'leadingAccessory' | 'size' | 'trailingAccessory'
> {
  size?: ZoraControlSize;
  leadingIcon?: Surface.ButtonIconSpec;
  trailingIcon?: Surface.ButtonIconSpec;
}
