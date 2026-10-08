import type React from 'react';

/*** Provides the native fallback type surface; RNW resolves the web adapter at runtime. */
export function ExplorerKeyboardProxy({ children }: ExplorerKeyboardProxyProps) {
  return <>{children}</>;
}

interface ExplorerKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (key: string, shiftKey: boolean) => void;
}
