import type React from 'react';

/*** Bridge browser keyboard events into the matrix's platform-neutral focus policy. */
export function MatrixGridKeyboardProxy({ children, onKeyDown }: MatrixGridKeyboardProxyProps) {
  return (
    <div
      onKeyDownCapture={(event) => {
        if (onKeyDown(event)) event.preventDefault();
      }}
      style={{ display: 'flex', flex: 1 }}
    >
      {children}
    </div>
  );
}

interface MatrixGridKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
}
