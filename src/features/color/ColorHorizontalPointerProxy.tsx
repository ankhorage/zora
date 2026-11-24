import type React from 'react';

export { ColorHorizontalPointerProxy } from './ColorHorizontalPointerProxy.native';

export interface ColorHorizontalPointerProxyProps {
  readonly children: React.ReactNode;
  readonly disabled: boolean;
  readonly onChange: (locationX: number) => void;
  readonly width: number;
}
