import type { ButtonIconSpec } from '@ankhorage/surface';
import type { ReactNode } from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface TileGridProps extends ZoraBaseProps {
  children?: ReactNode;
  columns?: number | 'responsive';
  compact?: boolean;
}

export interface PaletteItemProps extends ZoraBaseProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ButtonIconSpec;
  badge?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}
