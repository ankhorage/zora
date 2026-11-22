import type React from 'react';

/** Bridges DOM arrow-key navigation into the platform-neutral controlled palette callback. */
export function FlowNodePaletteKeyboardProxy({
  children,
  onKeyDown,
}: FlowNodePaletteKeyboardProxyProps) {
  return (
    <div
      onKeyDown={(event) => {
        if (onKeyDown(event.key)) event.preventDefault();
      }}
      style={{ display: 'flex', minHeight: 44 }}
    >
      {children}
    </div>
  );
}

interface FlowNodePaletteKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (key: string) => boolean;
}
