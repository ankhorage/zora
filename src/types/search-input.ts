import type { ZoraBaseProps } from './base';
import type { ZoraControlSize } from './control';

export interface SearchInputProps extends ZoraBaseProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
  clearable?: boolean;
  size?: ZoraControlSize;
  disabled?: boolean;
  readOnly?: boolean;
}
