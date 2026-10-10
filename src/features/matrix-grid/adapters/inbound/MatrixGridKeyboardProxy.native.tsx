import type React from 'react';

/*** Retain native accessibility focus while physical-key dispatch remains a web host concern. */
export function MatrixGridKeyboardProxy({ children }: MatrixGridKeyboardProxyProps) {
  return <>{children}</>;
}

interface MatrixGridKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
}
