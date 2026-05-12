import type React from 'react';

import type { ZoraEmphasis, ZoraTone } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type HeroAlign = 'start' | 'center';
export type HeroLayout = 'stack' | 'split' | 'mediaFirst';
export type HeroTone = 'default' | 'subtle' | 'outline';

export interface HeroAction {
  label: React.ReactNode;
  onPress: () => void;
  tone?: ZoraTone;
  emphasis?: ZoraEmphasis;
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
