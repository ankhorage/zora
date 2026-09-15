import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { ViewProps } from '../features/layout/public';
import type { ZoraBaseProps } from './base';

export type GradientColor = string;
export type GradientColors = readonly [GradientColor, GradientColor, ...GradientColor[]];
export type GradientLocations = readonly [number, number, ...number[]];

export interface GradientPoint {
  readonly x: number;
  readonly y: number;
}

export interface GradientRendererProps {
  children?: React.ReactNode;
  colors: GradientColors;
  locations?: GradientLocations;
  start?: GradientPoint;
  end?: GradientPoint;
  style?: StyleProp<ViewStyle>;
}

export type GradientRenderer = React.ComponentType<GradientRendererProps>;

export interface GradientRendererProviderProps {
  children?: React.ReactNode;
  renderer: GradientRenderer;
}

export interface GradientProps extends ZoraBaseProps {
  children?: React.ReactNode;
  colors: GradientColors;
  locations?: GradientLocations;
  start?: GradientPoint;
  end?: GradientPoint;
  width?: ViewProps['width'];
  height?: ViewProps['height'];
  minHeight?: ViewProps['minHeight'];
  radius?: ViewProps['radius'];
  p?: ViewProps['p'];
}
