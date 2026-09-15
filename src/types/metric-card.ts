import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { ZoraCardTone } from './card';
import type { ZoraColor } from './theme';

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
