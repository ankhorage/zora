import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface BreadcrumbItem {
  id: string;
  label: React.ReactNode;
  icon?: ButtonIconSpec;
  onPress?: () => void;
  disabled?: boolean;
}

export interface BreadcrumbsProps extends ZoraBaseProps {
  items: readonly BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  compact?: boolean;
  disabled?: boolean;
  testID?: string;
}
