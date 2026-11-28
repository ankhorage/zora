import React from 'react';

import type { ColorWheelPointerProxyProps } from './ColorWheelPointerProxy';

/*** Maps mouse, pen and touch coordinates into the wheel viewBox for click and drag selection. */
export function ColorWheelPointerProxy({
  children,
  disabled,
  height,
  onChange,
  renderedSize: _renderedSize,
  width,
}: ColorWheelPointerProxyProps) {
  const dragging = React.useRef(false);
  const changeAt = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.currentTarget as unknown as BrowserPointerTarget;
    const rect = target.getBoundingClientRect();
    onChange(
      ((event.clientX - rect.left) / rect.width) * width,
      ((event.clientY - rect.top) / rect.height) * height,
    );
  };

  return (
    <div
      onPointerDown={(event) => {
        if (disabled) return;
        dragging.current = true;
        (
          event.currentTarget as unknown as { setPointerCapture: (pointerId: number) => void }
        ).setPointerCapture(event.pointerId);
        changeAt(event);
      }}
      onPointerMove={(event) => {
        if (!disabled && dragging.current) changeAt(event);
      }}
      onPointerUp={(event) => {
        if (!disabled && dragging.current) changeAt(event);
        dragging.current = false;
      }}
      onPointerCancel={() => {
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
