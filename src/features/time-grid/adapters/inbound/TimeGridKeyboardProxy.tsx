import type React from 'react';

/*** Provides the native fallback type surface; React Native Web resolves the DOM adapter at runtime. */
export function TimeGridKeyboardProxy({ children }: TimeGridKeyboardProxyProps) {
  return <>{children}</>;
}

interface TimeGridKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (key: string) => boolean;
}
