import { StyleSheet, type ViewStyle } from 'react-native';

import type { GameOverlayPlacement, GameOverlayProps } from '../../../../types/gamePresentation';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

/*** Render an absolute game presentation layer for HUD, feedback, and phase content. */
export const GameOverlay = withZoraThemeScope(GameOverlayInner);

/*** Render the overlay inside the inherited ZORA theme scope. */
function GameOverlayInner({
  children,
  placement = 'fill',
  blocking = false,
  padding = 0,
  accessibilityLabel,
  interactionPolicy,
  testID,
}: GameOverlayProps) {
  return (
    <View
      {...(accessibilityLabel === undefined ? {} : { accessibilityLabel })}
      {...(testID === undefined ? {} : { testID })}
      pointerEvents={interactionPolicy === 'passive' ? 'none' : blocking ? 'auto' : 'box-none'}
      style={[styles.root, resolvePlacementStyle(placement), { padding }]}
    >
      {children}
    </View>
  );
}

/*** Resolve overlay alignment without coupling layout to any game genre or rule. */
function resolvePlacementStyle(placement: GameOverlayPlacement): ViewStyle {
  switch (placement) {
    case 'center':
      return { alignItems: 'center', justifyContent: 'center' };
    case 'top':
      return { alignItems: 'center', justifyContent: 'flex-start' };
    case 'bottom':
      return { alignItems: 'center', justifyContent: 'flex-end' };
    case 'top-left':
      return { alignItems: 'flex-start', justifyContent: 'flex-start' };
    case 'top-right':
      return { alignItems: 'flex-end', justifyContent: 'flex-start' };
    case 'bottom-left':
      return { alignItems: 'flex-start', justifyContent: 'flex-end' };
    case 'bottom-right':
      return { alignItems: 'flex-end', justifyContent: 'flex-end' };
    case 'fill':
      return {};
  }
}

const styles = StyleSheet.create({
  root: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
