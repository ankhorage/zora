import type { ColorWheelPointerProxyProps } from './ColorWheelPointerProxy';

/*** Leaves native SVG responders in charge of direct color-wheel gestures. */
export function ColorWheelPointerProxy({ children }: ColorWheelPointerProxyProps) {
  return children;
}
