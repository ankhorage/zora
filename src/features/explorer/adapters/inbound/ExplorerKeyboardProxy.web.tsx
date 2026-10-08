import type React from 'react';

/*** Bridges RNW's rendered DOM focus events into Explorer's platform-neutral navigation policy. */
export function ExplorerKeyboardProxy({ children, onKeyDown }: ExplorerKeyboardProxyProps) {
  return (
    <div
      onKeyDown={(event) => {
        if (onKeyDown(event.key, event.shiftKey)) event.preventDefault();
      }}
      style={{ display: 'flex', flex: 1 }}
    >
      {children}
    </div>
  );
}

interface ExplorerKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (key: string, shiftKey: boolean) => boolean;
}
