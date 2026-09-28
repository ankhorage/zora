import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { CardBackProps } from '../../../../types/tabletop';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { createTabletopColorScheme } from '../../utils/createTabletopColorScheme';
import { getTabletopCardDimensions } from '../../utils/getTabletopCardDimensions';

/*** Renders a face-down card with a non-revealing accessible label. */
export const CardBack = withZoraThemeScope(CardBackInner);

/*** Renders the card back using the active ZORA theme. */
function CardBackInner({
  size = 'medium',
  muted = false,
  accessibilityLabel,
  colorScheme,
  testID,
}: CardBackProps) {
  const { theme } = useZoraTheme();
  const colors = React.useMemo(
    () => createTabletopColorScheme(theme, colorScheme),
    [colorScheme, theme],
  );
  const dimensions = getTabletopCardDimensions(size);

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? 'Hidden card'}
      accessibilityRole="image"
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBack,
          borderColor: colors.cardBackBorder,
          borderRadius: dimensions.radius,
          height: dimensions.height,
          opacity: muted ? 0.48 : 1,
          width: dimensions.width,
        },
      ]}
      testID={testID}
    >
      <View
        style={[
          styles.inner,
          {
            borderColor: colors.cardBackBorder,
            borderRadius: Math.max(2, dimensions.radius - 3),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
  inner: {
    borderWidth: 1,
    height: '68%',
    opacity: 0.48,
    width: '68%',
  },
});
