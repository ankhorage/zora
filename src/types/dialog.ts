import type React from 'react';

import type { ZoraContentWidth } from '../internal/recipes';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface DialogProps extends ZoraBaseProps {
  visible: boolean;
  onDismiss?: () => void;
  closeOnBackdrop?: boolean;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  width?: ZoraContentWidth;
}
