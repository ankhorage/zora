import type { ButtonIconSpec } from '@ankhorage/surface';
import type { ReactNode } from 'react';

export interface TileGridProps {
  children?: ReactNode;
  columns?: number | 'responsive';
  compact?: boolean;
  testID?: string;
}

export interface PaletteItemProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ButtonIconSpec;
  badge?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  testID?: string;
}
