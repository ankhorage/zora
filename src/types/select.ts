import type { ZoraBaseProps } from './base';

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
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
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  testID?: string;
}
