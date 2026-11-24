import type React from 'react';

export { ColorWheelPointerProxy } from './ColorWheelPointerProxy.native';

export interface ColorWheelPointerProxyProps {
  readonly children: React.ReactNode;
  readonly disabled: boolean;
  readonly height: number;
  readonly onChange: (x: number, y: number) => void;
  readonly width: number;
}
