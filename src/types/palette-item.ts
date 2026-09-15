import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';

export interface PaletteItemProps extends ZoraBaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: ButtonIconSpec;
  badge?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}
