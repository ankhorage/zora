import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraCardTone, ZoraColor } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface MetricCardProps extends ZoraBaseProps {
  label: React.ReactNode;
  value: React.ReactNode;
  description?: React.ReactNode;
  icon?: ButtonIconSpec;
  delta?: React.ReactNode;
  deltaColor?: ZoraColor;
  actions?: React.ReactNode;
  tone?: ZoraCardTone;
  compact?: boolean;
  onPress?: () => void;
}
