import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { ZoraButtonVariant } from './button';
import type { ZoraColor } from './theme';

export type HeroAlign = 'start' | 'center';
export type HeroLayout = 'stack' | 'split' | 'mediaFirst';
export type HeroTone = 'default' | 'subtle' | 'outline';

export interface HeroAction {
  label: React.ReactNode;
  onPress: () => void;
  color?: ZoraColor;
  variant?: ZoraButtonVariant;
  disabled?: boolean;
}

export interface HeroProps extends ZoraBaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  media?: React.ReactNode;
  footer?: React.ReactNode;
  align?: HeroAlign;
  layout?: HeroLayout;
  tone?: HeroTone;
  compact?: boolean;
}
