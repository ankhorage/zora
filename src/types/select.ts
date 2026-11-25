import type { ButtonIconSpec, ButtonLabelWeight } from '@ankhorage/surface';

import type { ZoraBaseProps } from './base';
import type { ImageProps } from './image';

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
  /** Optional image rendered before this option label and in the trigger when selected. */
  leadingMedia?: ImageProps['source'];
  disabled?: boolean;
}

export interface SelectProps<TValue extends string = string> extends ZoraBaseProps {
  value?: TValue;
  defaultValue?: TValue;
  options: readonly SelectOption<TValue>[];
  onValueChange?: (value: TValue) => void;
  label?: string;
  helperText?: string;
  errorText?: string;
  placeholder?: string;
  /** Optional Surface icon source rendered before the trigger label. */
  leadingIcon?: ButtonIconSpec;
  /**
   * Optional image rendered before the trigger label. A selected option's leadingMedia takes
   * precedence. When present, media takes precedence over leadingIcon.
   */
  leadingMedia?: ImageProps['source'];
  /** Optional Surface Button label emphasis; defaults to semiBold. */
  labelWeight?: ButtonLabelWeight;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  testID?: string;
}
