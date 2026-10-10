import type React from 'react';

/*** Adapts web keyboard movement and resize commands without changing native responder behavior. */
export function GridInteractionsKeyboardProxy({
  children,
  onKeyDown,
}: GridInteractionsKeyboardProxyProps) {
  return (
    <div
      onKeyDown={(event) => {
        if (onKeyDown(event.key)) event.preventDefault();
      }}
      style={{ display: 'contents' }}
    >
      {children}
    </div>
  );
}

interface GridInteractionsKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (key: string) => boolean;
}
