import type React from 'react';

import type { BoxProps } from '../../foundation';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type GradientColor = string;
export type GradientColors = readonly [GradientColor, GradientColor, ...GradientColor[]];
export type GradientLocations = readonly [number, number, ...number[]];

export interface GradientPoint {
  readonly x: number;
  readonly y: number;
}

export interface GradientProps extends ZoraBaseProps {
  children?: React.ReactNode;
  colors: GradientColors;
  locations?: GradientLocations;
  start?: GradientPoint;
  end?: GradientPoint;
  width?: BoxProps['width'];
  height?: BoxProps['height'];
  minHeight?: BoxProps['minHeight'];
  radius?: BoxProps['radius'];
  p?: BoxProps['p'];
}
