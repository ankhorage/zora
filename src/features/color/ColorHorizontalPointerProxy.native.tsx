import type { ColorHorizontalPointerProxyProps } from './ColorHorizontalPointerProxy';

/*** Leaves native SVG responders in charge of horizontal slider gestures. */
export function ColorHorizontalPointerProxy({ children }: ColorHorizontalPointerProxyProps) {
  return children;
}
