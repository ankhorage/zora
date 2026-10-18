import React from 'react';

import type { GridInteractionPointer } from '../../../../types/grid-interactions';

/*** Adapts web keyboard movement and resize commands without changing native responder behavior. */
export function GridInteractionsKeyboardProxy({
  children,
  enabled,
  onKeyDown,
  onSpaceKeyChange,
}: GridInteractionsKeyboardProxyProps) {
  React.useEffect(() => {
    if (!enabled) onSpaceKeyChange(false);
  }, [enabled, onSpaceKeyChange]);
  React.useEffect(() => () => onSpaceKeyChange(false), [onSpaceKeyChange]);

  return (
    <div
      aria-label="Grid interaction keyboard controls"
      role="group"
      onBlur={() => onSpaceKeyChange(false)}
      onKeyDown={(event) => {
        if (!enabled) return;
        if (isSpaceKey(event)) onSpaceKeyChange(true);
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
      onKeyUp={(event) => {
        if (isSpaceKey(event)) onSpaceKeyChange(false);
      }}
      style={keyboardBoundaryStyle}
      tabIndex={enabled ? 0 : -1}
    >
      {children}
    </div>
  );
}

const keyboardBoundaryStyle = {
  alignSelf: 'stretch',
  display: 'flex',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
} as const;

interface GridInteractionsKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly enabled: boolean;
  readonly onKeyDown: (key: string, pointer: GridInteractionPointer) => boolean;
  readonly onSpaceKeyChange: (spaceKey: boolean) => void;
}

/*** Determines whether a web keyboard event represents the Space modifier. */
function isSpaceKey(event: React.KeyboardEvent<HTMLDivElement>): boolean {
  return event.code === 'Space' || event.key === ' ';
}
