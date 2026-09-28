import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { OpeningBookMove, OpeningBookProps } from '../../../../types/chess';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { createOpeningBookColorScheme } from '../../utils/createOpeningBookColorScheme';

/*** Renders caller-owned opening suggestions and their visual states. */
export const OpeningBook = withZoraThemeScope(OpeningBookInner);

/*** Formats an opening result percentage, accepting fractions or percentages. */
function rate(label: string, value: number | undefined): string | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  return `${label} ${Math.round(value <= 1 ? value * 100 : value)}%`;
}

/*** Resolves an opening move's stable row key. */
function moveKey(move: OpeningBookMove): string {
  return move.uci ?? move.fen ?? move.san;
}

/*** Renders the themed opening list without owning chess rules or data loading. */
function OpeningBookInner({
  moves = [],
  title = 'Opening book',
  loading = false,
  errorText,
  emptyText = 'No book moves for this position.',
  selectedMove = null,
  colorScheme,
  onMovePress,
  interactionPolicy,
  testID,
}: OpeningBookProps) {
  const { theme } = useZoraTheme();
  const colors = createOpeningBookColorScheme(theme, colorScheme);
  const stateText = loading ? 'Loading opening moves…' : (errorText ?? emptyText);
  const showState = loading || errorText !== undefined || moves.length === 0;
  return (
    <View
      accessibilityLabel={title}
      style={[
        styles.root,
        {
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
      ]}
      testID={testID}
    >
      <Text style={[styles.title, { color: colors.titleText }]}>{title}</Text>
      {!showState ? (
        <View style={styles.moves}>
          {moves.map((move) => {
            const selected =
              selectedMove !== null &&
              (selectedMove === move.san || selectedMove === move.uci || selectedMove === move.fen);
            const details = [
              move.eco,
              move.name,
              move.games === undefined ? undefined : `${move.games} games`,
            ].filter((part): part is string => typeof part === 'string' && part.length > 0);
            const stats = [
              rate('W', move.whiteWinRate),
              rate('D', move.drawRate),
              rate('B', move.blackWinRate),
            ].filter((part): part is string => part !== undefined);
            return (
              <Pressable
                accessibilityRole="button"
                disabled={onMovePress === undefined || interactionPolicy === 'passive'}
                key={moveKey(move)}
                onPress={() => {
                  if (interactionPolicy === 'passive') return;
                  onMovePress?.(move);
                }}
                style={[
                  styles.move,
                  {
                    backgroundColor: selected ? colors.selectedSurface : colors.surfaceHover,
                    borderColor: colors.border,
                  },
                ]}
                testID={testID ? `${testID}-move-${move.san}` : undefined}
              >
                <View style={styles.moveMain}>
                  <Text style={[styles.san, { color: colors.primaryText }]}>{move.san}</Text>
                  <Text style={[styles.meta, { color: colors.secondaryText }]}>
                    {details.length > 0 ? details.join(' · ') : 'Book move'}
                  </Text>
                </View>
                {stats.length > 0 ? (
                  <View style={[styles.metric, { backgroundColor: colors.metricSurface }]}>
                    <Text style={[styles.metricText, { color: colors.secondaryText }]}>
                      {stats.join(' ')}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={[styles.stateText, { color: colors.secondaryText }]}>{stateText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, gap: 10, padding: 12 },
  title: { fontSize: 15, fontWeight: '700', lineHeight: 20 },
  stateText: { fontSize: 13, lineHeight: 18 },
  moves: { gap: 8 },
  move: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  moveMain: { flex: 1, gap: 2 },
  san: { fontSize: 16, fontWeight: '700', lineHeight: 20 },
  meta: { fontSize: 12, lineHeight: 16 },
  metric: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  metricText: { fontSize: 11, fontWeight: '600' },
});
