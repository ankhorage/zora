import React from 'react';

import type { ColorHorizontalPointerProxyProps } from './ColorHorizontalPointerProxy';

/*** Maps browser drag coordinates into an SVG slider's stable viewbox width. */
export function ColorHorizontalPointerProxy({
  children,
  disabled,
  onChange,
  width,
}: ColorHorizontalPointerProxyProps) {
  const dragging = React.useRef(false);
  const changeAt = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget as unknown as BrowserPointerTarget;
    const rect = target.getBoundingClientRect();
    onChange(((event.clientX - rect.left) / rect.width) * width);
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
    readonly left: number;
    readonly width: number;
  };
}
