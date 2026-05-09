import type * as Surface from '@ankhorage/surface';

import type { ZoraControlSize } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface InputTrailingAction {
  icon: Surface.ButtonIconSpec;
  label: string;
  onPress: () => void;
}

type InputTrailingProps =
  | {
      trailingIcon?: Surface.ButtonIconSpec;
      trailingAction?: never;
    }
  | {
      trailingIcon?: never;
      trailingAction?: InputTrailingAction;
    };

export interface InputBaseProps
  extends
    ZoraBaseProps,
    Omit<
      Surface.TextInputProps,
      'leadingAccessory' | 'size' | 'trailingAccessory' | 'mode' | 'themeId'
    > {
  size?: ZoraControlSize;
  leadingIcon?: Surface.ButtonIconSpec;
}

export type InputProps = InputBaseProps & InputTrailingProps;
