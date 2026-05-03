import type * as Surface from '@ankhorage/surface';

import type { ZoraControlSize } from '../../internal/recipes';

export interface TextareaProps extends Omit<
  Surface.TextareaProps,
  'leadingAccessory' | 'size' | 'trailingAccessory'
> {
  size?: ZoraControlSize;
  leadingIcon?: Surface.ButtonIconSpec;
  trailingIcon?: Surface.ButtonIconSpec;
}
