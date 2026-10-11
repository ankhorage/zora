import type React from 'react';

import type { GridInteractionPointer } from '../../../../types/grid-interactions';

/*** Leaves native accessibility focus untouched where browser keyboard events are unavailable. */
export function GridInteractionsKeyboardProxy({ children }: GridInteractionsKeyboardProxyProps) {
  return <>{children}</>;
}

interface GridInteractionsKeyboardProxyProps {
  readonly children: React.ReactNode;
  readonly enabled: boolean;
  readonly onKeyDown: (key: string, pointer: GridInteractionPointer) => boolean;
  readonly onSpaceKeyChange: (spaceKey: boolean) => void;
}
