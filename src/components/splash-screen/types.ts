import type React from 'react';

import type { BoxProps } from '../../foundation';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type SplashScreenLogoShape = 'circle' | 'square' | 'rounded';

export interface SplashScreenProps extends ZoraBaseProps {
  logo?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  minHeight?: BoxProps['minHeight'];
  backgroundColor?: BoxProps['bg'];
  logoSize?: number;
  logoLabel?: string;
  logoShape?: SplashScreenLogoShape;
}
