import { StyleSheet } from 'react-native';

import type { GameFieldProps } from '../../../../types/gamePresentation';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

/*** Render a bounded relative-positioning surface for game presentation content. */
export const GameField = withZoraThemeScope(GameFieldInner);

/*** Render the field inside the inherited ZORA theme scope. */
function GameFieldInner({
  children,
  aspectRatio,
  minHeight = 320,
  fill = false,
  clip = true,
  accessibilityLabel,
  interactionPolicy,
  testID,
}: GameFieldProps) {
  return (
    <View
      {...(accessibilityLabel === undefined ? {} : { accessibilityLabel })}
      {...(testID === undefined ? {} : { testID })}
      interactionPolicy={interactionPolicy}
      pointerEvents={interactionPolicy === 'passive' ? 'none' : 'auto'}
      style={[
        styles.root,
        clip ? styles.clipped : styles.overflowVisible,
        fill ? styles.fill : undefined,
        {
          ...(aspectRatio === undefined ? {} : { aspectRatio }),
          minHeight,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  clipped: {
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
  overflowVisible: {
    overflow: 'visible',
  },
  root: {
    position: 'relative',
    width: '100%',
  },
});
