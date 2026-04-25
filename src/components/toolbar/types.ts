import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

export type ToolbarPosition = 'top' | 'bottom' | 'inline';

export interface ToolbarProps {
  children?: React.ReactNode;
  position?: ToolbarPosition;
  floating?: boolean;
  compact?: boolean;
  testID?: string;
}

export interface ToolbarActionProps {
  label: string;
  icon: ButtonIconSpec;
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  testID?: string;
}
