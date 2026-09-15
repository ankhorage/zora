import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { PopoverMenuAction } from './popover-menu';

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

export interface AppBarOverflowMenu {
  actions: readonly PopoverMenuAction[];
  label?: string;
  icon?: ButtonIconSpec;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onDismiss?: () => void;
}

export interface AppBarProps extends ZoraBaseProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
  overflow?: AppBarOverflowMenu;
  appMode?: AppBarMode;
  children?: React.ReactNode;
  safeAreaTop?: boolean;
  divider?: boolean;
}
