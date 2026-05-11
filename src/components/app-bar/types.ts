import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type AppBarMode =
  | {
      type: 'default';
    }
  | {
      type: 'selection';
      label: string;
      count?: number;
      onCancel: () => void;
      cancelLabel?: string;
      cancelIcon?: ButtonIconSpec;
    };

export interface AppBarOverflowAction {
  onPress: () => void;
  label?: string;
  icon?: ButtonIconSpec;
  disabled?: boolean;
}

export interface AppBarProps extends ZoraBaseProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
  overflow?: AppBarOverflowAction;
  appMode?: AppBarMode;
  children?: React.ReactNode;
  safeAreaTop?: boolean;
  divider?: boolean;
}
