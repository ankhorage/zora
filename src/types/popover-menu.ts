import type {
  ButtonIconSpec,
  PopoverAnchorRenderProps,
  PopoverMenuActionIntent as SurfacePopoverMenuActionIntent,
} from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';

export type PopoverMenuActionIntent = SurfacePopoverMenuActionIntent;

export interface PopoverMenuAction {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: ButtonIconSpec;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  intent?: PopoverMenuActionIntent;
  disabled?: boolean;
  selected?: boolean;
  onPress?: () => void;
}

export interface PopoverMenuProps extends ZoraBaseProps {
  trigger: (controls: PopoverAnchorRenderProps) => React.ReactNode;
  actions: readonly PopoverMenuAction[];
  onDismiss?: () => void;
  closeOnSelect?: boolean;
  testID?: string;
}
