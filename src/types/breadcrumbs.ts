import type { ButtonIconSpec } from '@ankhorage/surface';

import type { ZoraBaseProps } from './base';

export interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: ButtonIconSpec;
  disabled?: boolean;
}

export interface BreadcrumbPressEvent {
  id: string;
}

export interface BreadcrumbsProps extends ZoraBaseProps {
  items: readonly BreadcrumbItem[];
  separator?: string;
  maxItems?: number;
  compact?: boolean;
  disabled?: boolean;
  onItemPress?: (event: BreadcrumbPressEvent) => void;
  testID?: string;
}
