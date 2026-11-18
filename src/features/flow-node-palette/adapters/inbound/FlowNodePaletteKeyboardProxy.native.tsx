import type React from 'react';

/** Retains the native accessible press behavior without adding a DOM-only keyboard wrapper. */
export function FlowNodePaletteKeyboardProxy({ children }: FlowNodePaletteKeyboardProxyProps) {
  return <>{children}</>;
}

interface FlowNodePaletteKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (key: string) => boolean;
}
