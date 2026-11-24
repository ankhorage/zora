import React from 'react';

import type { ColorWheelPointerProxyProps } from './ColorWheelPointerProxy';

/*** Maps browser pointer coordinates into the fixed SVG wheel viewport for click and drag selection. */
export function ColorWheelPointerProxy({
  children,
  disabled,
  height,
  onChange,
  width,
}: ColorWheelPointerProxyProps) {
  const dragging = React.useRef(false);
  const changeAt = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget as unknown as BrowserPointerTarget;
    const rect = target.getBoundingClientRect();
    onChange(
      ((event.clientX - rect.left) / rect.width) * width,
      ((event.clientY - rect.top) / rect.height) * height,
    );
  };

  return (
    <div
      onMouseDown={(event) => {
        if (disabled) return;
        dragging.current = true;
        changeAt(event);
      }}
      onMouseMove={(event) => {
        if (!disabled && dragging.current) changeAt(event);
      }}
      onMouseUp={(event) => {
        if (!disabled && dragging.current) changeAt(event);
        dragging.current = false;
      }}
      style={{ touchAction: 'none' }}
    >
      {children}
    </div>
  );
}

interface BrowserPointerTarget {
  readonly getBoundingClientRect: () => {
    readonly height: number;
    readonly left: number;
    readonly top: number;
    readonly width: number;
  };
}
