import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<TValue extends string = string> extends ZoraBaseProps {
  value: TValue;
  options: readonly SelectOption<TValue>[];
  onValueChange: (value: TValue) => void;
  disabled?: boolean;
  invalid?: boolean;
}
