import type React from 'react';

/** Provides the native fallback while React Native Web resolves the DOM keyboard adapter. */
export function FlowNodePaletteKeyboardProxy({ children }: FlowNodePaletteKeyboardProxyProps) {
  return <>{children}</>;
}

interface FlowNodePaletteKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (key: string) => boolean;
}
