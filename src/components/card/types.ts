import type { CardProps as SurfaceCardProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraCardTone } from '../../internal/recipes';

export interface CardProps extends Omit<
  SurfaceCardProps,
  'children' | 'p' | 'radius' | 'style' | 'variant'
> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  tone?: ZoraCardTone;
  compact?: boolean;
}
