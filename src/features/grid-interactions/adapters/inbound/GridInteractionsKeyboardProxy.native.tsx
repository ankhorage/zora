import type React from 'react';

/*** Leaves native accessibility focus untouched where browser keyboard events are unavailable. */
export function GridInteractionsKeyboardProxy({ children }: GridInteractionsKeyboardProxyProps) {
  return <>{children}</>;
}

interface GridInteractionsKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (key: string) => boolean;
}
