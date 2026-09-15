import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { ZoraControlSize } from './control';
import type { ZoraColor } from './theme';

export interface ChipProps extends ZoraBaseProps {
  children: React.ReactNode;
  icon?: ButtonIconSpec;
  selected?: boolean;
  disabled?: boolean;
  color?: ZoraColor;
  size?: ZoraControlSize;
  onPress?: () => void;
}

export interface ChipColors {
  backgroundColor: string;
  borderColor: string;
  contentColor: string;
  opacity?: number;
}

export interface ChipInteractionState {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
  disabled: boolean;
}
