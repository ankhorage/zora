import React from 'react';

import type { ColorWheelPointerProxyProps } from './ColorWheelPointerProxy';

/*** Adds the sole native responder path to the SVG wheel. */
export function ColorWheelPointerProxy({
  children,
  disabled,
  height,
  onChange,
  width,
  renderedSize = width,
}: ColorWheelPointerProxyProps) {
  if (!React.isValidElement(children)) return children;
  const changeAt = (event: {
    readonly nativeEvent: { readonly locationX: number; readonly locationY: number };
  }) =>
    onChange(
      (event.nativeEvent.locationX / renderedSize) * width,
      (event.nativeEvent.locationY / renderedSize) * height,
    );
  return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
    onResponderGrant: disabled ? undefined : changeAt,
    onResponderMove: disabled ? undefined : changeAt,
    onResponderRelease: disabled ? undefined : changeAt,
    onStartShouldSetResponder: () => !disabled,
  });
}
