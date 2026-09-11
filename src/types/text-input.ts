import type * as Surface from '@ankhorage/surface';

import type { ZoraControlSize } from '../internal/recipes';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

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
