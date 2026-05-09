import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraControlSize, ZoraTone } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ChipProps extends ZoraBaseProps {
  children: React.ReactNode;
  icon?: ButtonIconSpec;
  selected?: boolean;
  disabled?: boolean;
  tone?: ZoraTone;
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
