import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { CardHandProps } from '../../../../types/tabletop';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { CardBack } from './CardBack';
import { PlayingCard } from './PlayingCard';

/*** Renders a compact row of face-up and face-down cards. */
export const CardHand = withZoraThemeScope(CardHandInner);

/*** Creates stable indices for non-revealing card backs. */
function createFaceDownCards(count: number): readonly number[] {
  return Array.from({ length: Math.max(0, count) }, (_, index) => index);
}

/*** Renders the card row from caller-owned values. */
function CardHandInner({
  cards = [],
  faceDownCards = 0,
  size = 'medium',
  muted = false,
  colorScheme,
  accessibilityLabel,
  testID,
}: CardHandProps) {
  const hiddenCards = createFaceDownCards(faceDownCards);

  return (
    <View accessibilityLabel={accessibilityLabel} style={styles.hand} testID={testID}>
      {cards.map((card, index) => (
        <PlayingCard
          card={card}
          colorScheme={colorScheme}
          key={`${card.rank}-${card.suit}-${index}`}
          muted={muted}
          size={size}
          testID={testID ? `${testID}-card-${index}` : undefined}
        />
      ))}
      {hiddenCards.map((index) => (
        <CardBack
          colorScheme={colorScheme}
          key={`hidden-${index}`}
          muted={muted}
          size={size}
          testID={testID ? `${testID}-hidden-${index}` : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
});
