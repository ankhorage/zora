import type * as Surface from '@ankhorage/surface';

import type { ZoraControlSize } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface TextareaProps
  extends
    ZoraBaseProps,
    Omit<
      Surface.TextareaProps,
      'leadingAccessory' | 'size' | 'trailingAccessory' | 'mode' | 'themeId'
    > {
  size?: ZoraControlSize;
  leadingIcon?: Surface.ButtonIconSpec;
  trailingIcon?: Surface.ButtonIconSpec;
}
