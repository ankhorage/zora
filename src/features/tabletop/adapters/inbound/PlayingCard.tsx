import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { PlayingCardProps } from '../../../../types/tabletop';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { createTabletopColorScheme } from '../../utils/createTabletopColorScheme';
import { getPlayingCardLabel } from '../../utils/getPlayingCardLabel';
import { getTabletopCardDimensions } from '../../utils/getTabletopCardDimensions';

const suitMarks = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' } as const;

/*** Renders a face-up playing card with an accessible rank and suit. */
export const PlayingCard = withZoraThemeScope(PlayingCardInner);

/*** Renders the card face using the active ZORA theme. */
function PlayingCardInner({
  card,
  size = 'medium',
  selected = false,
  muted = false,
  accessibilityLabel,
  colorScheme,
  testID,
}: PlayingCardProps) {
  const { theme } = useZoraTheme();
  const colors = React.useMemo(
    () => createTabletopColorScheme(theme, colorScheme),
    [colorScheme, theme],
  );
  const dimensions = getTabletopCardDimensions(size);
  const suitColor =
    card.suit === 'hearts' || card.suit === 'diamonds' ? colors.redSuitText : colors.cardText;

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? getPlayingCardLabel(card)}
      accessibilityRole="image"
      style={[
        styles.card,
        {
          backgroundColor: colors.cardSurface,
          borderColor: selected ? colors.seatSelectedBorder : colors.cardBorder,
          borderRadius: dimensions.radius,
          height: dimensions.height,
          opacity: muted ? 0.48 : 1,
          width: dimensions.width,
        },
      ]}
      testID={testID}
    >
      <Text
        selectable={false}
        style={[
          styles.rank,
          {
            color: suitColor,
            fontSize: dimensions.rankFontSize,
            lineHeight: dimensions.rankFontSize + 4,
          },
        ]}
      >
        {card.rank}
      </Text>
      <Text
        selectable={false}
        style={[
          styles.suit,
          {
            color: suitColor,
            fontSize: dimensions.suitFontSize,
            lineHeight: dimensions.suitFontSize + 3,
          },
        ]}
      >
        {suitMarks[card.suit]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
  rank: {
    fontWeight: '800',
  },
  suit: {
    fontWeight: '700',
    marginTop: -2,
  },
});
