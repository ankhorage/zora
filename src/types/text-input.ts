import type * as Surface from '@ankhorage/surface';

import type { ZoraBaseProps } from './base';
import type { ZoraControlSize } from './control';

export interface TextInputTrailingAction {
  icon: Surface.ButtonIconSpec;
  label: string;
  onPress: () => void;
}

type TextInputTrailingProps =
  | {
      trailingIcon?: Surface.ButtonIconSpec;
      trailingAction?: never;
    }
  | {
      trailingIcon?: never;
      trailingAction?: TextInputTrailingAction;
    };

interface TextInputBaseProps
  extends
    ZoraBaseProps,
    Omit<
      Surface.TextInputProps,
      'leadingAccessory' | 'size' | 'trailingAccessory' | 'mode' | 'themeId'
    > {
  size?: ZoraControlSize;
  leadingIcon?: Surface.ButtonIconSpec;
}

export type TextInputProps = TextInputBaseProps & TextInputTrailingProps;
