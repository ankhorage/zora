import type React from 'react';

/*** Keeps Explorer navigation portable when a native host has no DOM keyboard event surface. */
export function ExplorerKeyboardProxy({ children }: ExplorerKeyboardProxyProps) {
  return <>{children}</>;
}

interface ExplorerKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (key: string, shiftKey: boolean) => boolean;
}
