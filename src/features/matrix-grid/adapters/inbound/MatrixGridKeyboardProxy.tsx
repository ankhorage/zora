import type React from 'react';

/*** Provides the native fallback type surface; RNW resolves the web adapter at runtime. */
export function MatrixGridKeyboardProxy({ children }: MatrixGridKeyboardProxyProps) {
  return <>{children}</>;
}

interface MatrixGridKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
}
