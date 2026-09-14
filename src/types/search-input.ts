import type { ZoraControlSize } from '../internal/recipes';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

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
