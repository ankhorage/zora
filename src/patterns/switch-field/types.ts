import type { ReactNode } from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface SwitchFieldProps extends ZoraBaseProps {
  label: ReactNode;
  description?: ReactNode;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}
