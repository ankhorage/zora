import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type ToolbarPosition = 'top' | 'bottom' | 'inline';

export interface ToolbarProps extends ZoraBaseProps {
  children?: React.ReactNode;
  position?: ToolbarPosition;
  floating?: boolean;
  compact?: boolean;
}

export interface ToolbarActionProps extends ZoraBaseProps {
  label: string;
  icon: ButtonIconSpec;
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}
