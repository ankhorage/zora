import { useBottomSheet } from '@ankhorage/surface/bottom-sheet';
import React from 'react';

import type { BottomSheetProps } from '../../../../types/manifest-bottom-sheet';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { useZoraThemeRuntime } from '../../../theme/composition/ZoraThemeRuntimeContext';

/*** Presents declarative manifest children through the shared Surface sheet host. */
export const BottomSheet = withZoraThemeScope(BottomSheetInner);

/*** Bridges the declarative lifecycle and inherited theme into the shared modal host. */
function BottomSheetInner({
  mode: _mode,
  themeId: _themeId,
  children,
  open = false,
  interactionPolicy,
  testID,
  snapPoints,
  initialIndex,
  enableDynamicSizing,
  enablePanDownToClose,
  dismissOnBackdropPress,
  keyboardBehavior,
  keyboardBlurBehavior,
  onDismiss,
  onIndexChange,
}: BottomSheetProps) {
  const { present, dismiss } = useBottomSheet();
  const { mode } = useZoraTheme();
  const { themeId } = useZoraThemeRuntime();
  const active = open && interactionPolicy !== 'passive';
  const dismissed = React.useRef(false);

  React.useEffect(() => {
    dismissed.current = false;
    if (!active) return;
    return () => {
      dismiss();
    };
  }, [active, dismiss]);

  React.useEffect(() => {
    if (!active || dismissed.current) return;
    present({
      content: (
        <View mode={mode} themeId={themeId} testID={testID}>
          {children}
        </View>
      ),
      snapPoints,
      initialIndex,
      enableDynamicSizing,
      enablePanDownToClose,
      dismissOnBackdropPress,
      keyboardBehavior,
      keyboardBlurBehavior,
      onDismiss: () => {
        dismissed.current = true;
        onDismiss?.();
      },
      onIndexChange: (index) => onIndexChange?.({ index }),
    });
  }, [
    active,
    children,
    dismissOnBackdropPress,
    enableDynamicSizing,
    enablePanDownToClose,
    initialIndex,
    keyboardBehavior,
    keyboardBlurBehavior,
    mode,
    onDismiss,
    onIndexChange,
    present,
    snapPoints,
    testID,
    themeId,
  ]);

  return null;
}
