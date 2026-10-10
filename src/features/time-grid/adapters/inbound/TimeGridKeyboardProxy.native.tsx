import type React from 'react';

/*** Preserves native activation and touch interaction where DOM arrow-key events do not exist. */
export function TimeGridKeyboardProxy({ children }: TimeGridKeyboardProxyProps) {
  return <>{children}</>;
}

interface TimeGridKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (key: string) => boolean;
}
