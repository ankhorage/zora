import type React from 'react';

/*** Bridges DOM arrow keys into portable interval focus navigation on React Native Web. */
export function TimeGridKeyboardProxy({ children, onKeyDown }: TimeGridKeyboardProxyProps) {
  return (
    <div
      onKeyDown={(event) => {
        if (onKeyDown(event.key)) event.preventDefault();
      }}
      style={{ display: 'flex', flex: 1 }}
    >
      {children}
    </div>
  );
}

interface TimeGridKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly onKeyDown: (key: string) => boolean;
}
