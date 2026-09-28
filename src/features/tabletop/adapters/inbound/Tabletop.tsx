import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type {
  CardBackProps,
  CardHandProps,
  PlayingCardProps,
  PlayingCardSuit,
  PokerTrainingTableProps,
  TabletopCardSize,
  TabletopColorOverrides,
  TabletopSeatCount,
  TabletopSeatState,
  TabletopTableProps,
} from '../../../../types/tabletop';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';

const suits = new Map<PlayingCardSuit, string>([
  ['clubs', '♣'],
  ['diamonds', '♦'],
  ['hearts', '♥'],
  ['spades', '♠'],
]);
const dimensions = new Map<
  TabletopCardSize,
  { readonly height: number; readonly width: number; readonly font: number }
>([
  ['small', { height: 42, width: 30, font: 12 }],
  ['medium', { height: 66, width: 46, font: 18 }],
  ['large', { height: 88, width: 62, font: 24 }],
]);
const defaultCardDimensions = { height: 66, width: 46, font: 18 } as const;

/*** Renders a themed face-down card without exposing a card value. */
export const CardBack = withZoraThemeScope(CardBackInner);
/*** Renders a themed face-up playing card. */
export const PlayingCard = withZoraThemeScope(PlayingCardInner);
/*** Renders a compact group of visible and hidden playing cards. */
export const CardHand = withZoraThemeScope(CardHandInner);
/*** Renders generic table state around a responsive card-table surface. */
export const TabletopTable = withZoraThemeScope(TabletopTableInner);
/*** Maps a serializable poker-training presentation task to the generic table surface. */
export const PokerTrainingTable = withZoraThemeScope(PokerTrainingTableInner);

function useTabletopColors(overrides: TabletopColorOverrides = {}) {
  const { theme } = useZoraTheme();
  return {
    cardBack: theme.semantics.warning.base,
    cardBackBorder: theme.semantics.neutral.border,
    cardBorder: theme.semantics.neutral.border,
    cardSurface: theme.semantics.neutral.surface,
    cardText: theme.semantics.content.default,
    redSuitText: theme.semantics.warning.base,
    seatBorder: theme.semantics.neutral.divider,
    seatMutedText: theme.semantics.content.muted,
    seatSelectedBorder: theme.semantics.action.primary.base,
    seatSurface: theme.semantics.neutral.surface,
    seatText: theme.semantics.content.default,
    tableBorder: theme.semantics.warning.base,
    tableFelt: theme.semantics.action.primary.softBg,
    tableInnerBorder: theme.semantics.neutral.divider,
    tableMutedText: theme.semantics.content.muted,
    tokenSurface: theme.semantics.warning.softBg,
    tokenText: theme.semantics.content.default,
    ...overrides,
  };
}

function CardBackInner({
  size = 'medium',
  muted = false,
  accessibilityLabel = 'Hidden card',
  colorScheme,
  testID,
}: CardBackProps) {
  const colors = useTabletopColors(colorScheme);
  const value = dimensions.get(size) ?? defaultCardDimensions;
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBack,
          borderColor: colors.cardBackBorder,
          height: value.height,
          opacity: muted ? 0.48 : 1,
          width: value.width,
        },
      ]}
      testID={testID}
    >
      <View style={[styles.cardBack, { borderColor: colors.cardBackBorder }]} />
    </View>
  );
}
function PlayingCardInner({
  card,
  size = 'medium',
  selected = false,
  muted = false,
  accessibilityLabel = `${card.rank} of ${card.suit}`,
  colorScheme,
  testID,
}: PlayingCardProps) {
  const colors = useTabletopColors(colorScheme);
  const value = dimensions.get(size) ?? defaultCardDimensions;
  const color =
    card.suit === 'hearts' || card.suit === 'diamonds' ? colors.redSuitText : colors.cardText;
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      style={[
        styles.card,
        {
          backgroundColor: colors.cardSurface,
          borderColor: selected ? colors.seatSelectedBorder : colors.cardBorder,
          height: value.height,
          opacity: muted ? 0.48 : 1,
          width: value.width,
        },
      ]}
      testID={testID}
    >
      <Text selectable={false} style={[styles.cardText, { color, fontSize: value.font }]}>
        {card.rank}
      </Text>
      <Text selectable={false} style={[styles.cardText, { color, fontSize: value.font }]}>
        {suits.get(card.suit)}
      </Text>
    </View>
  );
}
function CardHandInner({
  cards = [],
  faceDownCards = 0,
  size = 'medium',
  muted = false,
  colorScheme,
  accessibilityLabel,
  testID,
}: CardHandProps) {
  return (
    <View accessibilityLabel={accessibilityLabel} style={styles.hand} testID={testID}>
      {cards.map((card, index) => (
        <PlayingCard
          card={card}
          colorScheme={colorScheme}
          key={`${card.rank}-${card.suit}-${index}`}
          muted={muted}
          size={size}
        />
      ))}
      {Array.from({ length: Math.max(0, faceDownCards) }, (_, index) => (
        <CardBack colorScheme={colorScheme} key={`hidden-${index}`} muted={muted} size={size} />
      ))}
    </View>
  );
}
function TabletopTableInner({
  seats,
  centerCards = [],
  centerLabel,
  centerSublabel,
  shape = 'oval',
  seatCount,
  cardSize = 'small',
  disabled = false,
  colorScheme,
  accessibilityLabel,
  testID,
}: TabletopTableProps) {
  const colors = useTabletopColors(colorScheme);
  const count = normalizeSeatCount(seatCount ?? seats.length);
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.root, { opacity: disabled ? 0.56 : 1 }]}
      testID={testID}
    >
      <View
        style={[
          styles.surface,
          shape === 'rounded' ? styles.rounded : styles.oval,
          { backgroundColor: colors.tableFelt, borderColor: colors.tableBorder },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.inner,
            shape === 'rounded' ? styles.rounded : styles.oval,
            { borderColor: colors.tableInnerBorder },
          ]}
        />
        <View style={styles.center}>
          {centerCards.length > 0 ? (
            <CardHand cards={centerCards} colorScheme={colorScheme} size={cardSize} />
          ) : null}
          {centerLabel === undefined ? null : (
            <Text style={[styles.label, { color: colors.seatText }]}>{centerLabel}</Text>
          )}
          {centerSublabel === undefined ? null : (
            <Text style={[styles.sublabel, { color: colors.tableMutedText }]}>
              {centerSublabel}
            </Text>
          )}
        </View>
      </View>
      {seats.map((seat, index) => (
        <Seat
          colorScheme={colorScheme}
          count={count}
          index={index}
          key={seat.id}
          seat={seat}
          size={seat.selected && cardSize === 'small' ? 'medium' : cardSize}
          testID={testID}
        />
      ))}
    </View>
  );
}
function Seat({
  seat,
  index,
  count,
  size,
  colorScheme,
  testID,
}: {
  readonly seat: TabletopSeatState;
  readonly index: number;
  readonly count: TabletopSeatCount;
  readonly size: TabletopCardSize;
  readonly colorScheme?: TabletopColorOverrides;
  readonly testID?: string;
}) {
  const colors = useTabletopColors(colorScheme);
  const position = seatPosition(index, count);
  return (
    <View
      accessibilityLabel={seat.accessibilityLabel}
      accessibilityRole="summary"
      style={[
        styles.seat,
        {
          left: position.left,
          opacity: seat.muted ? 0.48 : 1,
          top: position.top,
          borderColor: seat.selected ? colors.seatSelectedBorder : colors.seatBorder,
          backgroundColor: colors.seatSurface,
        },
      ]}
      testID={testID ? `${testID}-seat-${seat.id}` : undefined}
    >
      <Text
        style={[styles.label, { color: seat.disabled ? colors.seatMutedText : colors.seatText }]}
      >
        {seat.label}
      </Text>
      {seat.sublabel === undefined ? null : (
        <Text style={[styles.sublabel, { color: colors.seatMutedText }]}>{seat.sublabel}</Text>
      )}
      {seat.cards === undefined && seat.faceDownCards === undefined ? null : (
        <CardHand
          cards={seat.cards}
          colorScheme={colorScheme}
          faceDownCards={seat.faceDownCards}
          muted={seat.muted}
          size={size}
        />
      )}
      {seat.tokenLabel === undefined ? null : (
        <Text
          style={[styles.token, { backgroundColor: colors.tokenSurface, color: colors.tokenText }]}
        >
          {seat.tokenLabel}
        </Text>
      )}
    </View>
  );
}
function PokerTrainingTableInner({
  task = {},
  defaultStackBigBlinds = 100,
  ...props
}: PokerTrainingTableProps) {
  const bigBlind = task.blinds?.big ?? 1;
  const players = task.players ?? [];
  const seats: TabletopSeatState[] = players.map((player) => ({
    id: player.position,
    label: player.position,
    sublabel: player.stack === undefined ? undefined : `${Math.round(player.stack / bigBlind)} BB`,
    cards: player.isHero ? (task.heroCards ?? player.cards) : player.cards,
    faceDownCards: player.isHero ? 0 : player.cards === undefined ? 2 : undefined,
    selected: player.isHero ?? player.position === task.heroPosition,
    muted: player.folded,
    tokenLabel: player.bet === undefined ? undefined : String(player.bet),
  }));
  const heroExists = seats.some((seat) => seat.selected);
  if (!heroExists && task.heroPosition !== undefined)
    seats.push({
      id: task.heroPosition,
      label: task.heroPosition,
      sublabel: `${defaultStackBigBlinds} BB`,
      cards: task.heroCards,
      selected: true,
    });
  return (
    <TabletopTable
      {...props}
      centerCards={task.communityCards}
      centerLabel={task.pot === undefined ? undefined : `Pot ${task.pot}`}
      centerSublabel={
        task.blinds === undefined ? undefined : `${task.blinds.small}/${task.blinds.big}`
      }
      seatCount={task.tableSize === '9max' ? 9 : 6}
      seats={seats}
    />
  );
}
function normalizeSeatCount(value: number): TabletopSeatCount {
  return Math.min(10, Math.max(2, value)) as TabletopSeatCount;
}
function seatPosition(
  index: number,
  count: number,
): { readonly left: `${number}%`; readonly top: `${number}%` } {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  return { left: `${50 + Math.cos(angle) * 42}%`, top: `${50 + Math.sin(angle) * 42}%` };
}
const styles = StyleSheet.create({
  root: { aspectRatio: 1.45, justifyContent: 'center', position: 'relative', width: '100%' },
  surface: {
    alignSelf: 'center',
    borderWidth: 2,
    height: '62%',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '76%',
  },
  oval: { borderRadius: 999 },
  rounded: { borderRadius: 24 },
  inner: {
    borderWidth: 1,
    height: '82%',
    left: '8%',
    position: 'absolute',
    top: '9%',
    width: '84%',
  },
  center: { alignItems: 'center', gap: 6 },
  hand: { flexDirection: 'row', gap: 4 },
  card: { alignItems: 'center', borderRadius: 4, borderWidth: 1, justifyContent: 'center' },
  cardBack: { borderRadius: 2, borderWidth: 1, height: '74%', width: '74%' },
  cardText: { fontWeight: '700' },
  seat: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
    minWidth: 72,
    padding: 5,
    position: 'absolute',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
  },
  label: { fontSize: 12, fontWeight: '600' },
  sublabel: { fontSize: 11 },
  token: {
    borderRadius: 99,
    fontSize: 10,
    overflow: 'hidden',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});
