import type React from 'react';

import type { ZoraButtonVariant, ZoraColor } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ConfirmDialogProps extends ZoraBaseProps {
  visible: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  confirmColor?: ZoraColor;
  confirmVariant?: ZoraButtonVariant;
  busy?: boolean;
  closeOnBackdrop?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}
