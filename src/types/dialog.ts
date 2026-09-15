import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { ZoraContentWidth } from './layout';

export interface DialogProps extends ZoraBaseProps {
  visible: boolean;
  onDismiss?: () => void;
  closeOnBackdrop?: boolean;
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  width?: ZoraContentWidth;
}
