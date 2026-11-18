import type React from 'react';

export { ColorWheelKeyboardProxy } from './ColorWheelKeyboardProxy.native';

export interface ColorWheelKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly chroma: number;
  readonly disabled: boolean;
  readonly hue: number;
  readonly onChange: (hue: number, chroma: number) => void;
}
