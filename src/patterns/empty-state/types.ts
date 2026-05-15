import type React from 'react';

import type { ZoraColor, ZoraEmphasis } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface EmptyStateAction {
  label: React.ReactNode;
  onPress: () => void;
  color?: ZoraColor;
  emphasis?: ZoraEmphasis;
}

export interface EmptyStateProps extends ZoraBaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  footer?: React.ReactNode;
}
