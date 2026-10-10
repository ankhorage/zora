import type React from 'react';

import type { GridInteractionPointer } from '../../../../types/grid-interactions';

/*** Adapts web keyboard movement and resize commands without changing native responder behavior. */
export function GridInteractionsKeyboardProxy({
  children,
  enabled,
  onKeyDown,
}: GridInteractionsKeyboardProxyProps) {
  return (
    <div
      aria-label="Grid interaction keyboard controls"
      onKeyDown={(event) => {
        if (!enabled) return;
        if (
          onKeyDown(event.key, {
            altKey: event.altKey,
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
            shiftKey: event.shiftKey,
            x: 0,
            y: 0,
          })
        ) {
          event.preventDefault();
        }
      }}
      style={{ display: 'contents' }}
      tabIndex={enabled ? 0 : -1}
    >
      {children}
    </div>
  );
}

interface GridInteractionsKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly enabled: boolean;
  readonly onKeyDown: (key: string, pointer: GridInteractionPointer) => boolean;
}
