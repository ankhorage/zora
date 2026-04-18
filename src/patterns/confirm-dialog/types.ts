import type React from 'react';

import type { ZoraEmphasis, ZoraTone } from '../../internal/recipes';

export interface ConfirmDialogProps {
  visible: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  confirmTone?: ZoraTone;
  confirmEmphasis?: ZoraEmphasis;
  busy?: boolean;
  closeOnBackdrop?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  testID?: string;
}
