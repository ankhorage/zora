import type React from 'react';

import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface BottomSheetProps extends ZoraBaseProps {
  children?: React.ReactNode;
  open?: boolean;
  snapPoints?: readonly (number | string)[];
  initialIndex?: number;
  enableDynamicSizing?: boolean;
  enablePanDownToClose?: boolean;
  dismissOnBackdropPress?: boolean;
  keyboardBehavior?: 'extend' | 'fillParent' | 'interactive';
  keyboardBlurBehavior?: 'none' | 'restore';
  onDismiss?: () => void;
  onIndexChange?: (event: { index: number }) => void;
}
