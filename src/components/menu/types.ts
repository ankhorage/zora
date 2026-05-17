import type {
  ButtonIconSpec,
  MenuActionIntent as SurfaceMenuActionIntent,
  MenuProps as SurfaceMenuProps,
} from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type MenuActionIntent = SurfaceMenuActionIntent;

export interface MenuAction {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: ButtonIconSpec;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  intent?: MenuActionIntent;
  disabled?: boolean;
  selected?: boolean;
  onPress?: () => void;
}

export interface MenuProps
  extends ZoraBaseProps, Omit<SurfaceMenuProps, 'actions' | 'dismiss' | 'mode' | 'themeId'> {
  actions: readonly MenuAction[];
  onDismiss?: () => void;
}

export type DropdownMenuProps = MenuProps;
