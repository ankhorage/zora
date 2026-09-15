import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { ZoraButtonVariant } from './button';
import type { ZoraColor } from './theme';

export interface EmptyStateAction {
  label: React.ReactNode;
  onPress: () => void;
  color?: ZoraColor;
  variant?: ZoraButtonVariant;
}

export interface EmptyStateProps extends ZoraBaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  footer?: React.ReactNode;
}
