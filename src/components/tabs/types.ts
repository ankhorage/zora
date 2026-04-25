import type { ButtonIconSpec } from '@ankhorage/surface';
import type { ReactNode } from 'react';

import type { ZoraControlSize } from '../../internal/recipes';

export interface TabItem<TValue extends string = string> {
  value: TValue;
  label: ReactNode;
  icon?: ButtonIconSpec;
  badge?: ReactNode;
  disabled?: boolean;
  testID?: string;
}

export type TabsVariant = 'underline' | 'pill' | 'segmented';

export interface TabsProps<TValue extends string = string> {
  value: TValue;
  items: readonly TabItem<TValue>[];
  onValueChange: (value: TValue) => void;
  variant?: TabsVariant;
  size?: ZoraControlSize;
  disabled?: boolean;
  testID?: string;
}
