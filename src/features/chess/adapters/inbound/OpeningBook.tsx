import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { OpeningBookProps } from '../../../../types/chess';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';

/*** Renders caller-owned opening suggestions and their visual states. */
export const OpeningBook = withZoraThemeScope(OpeningBookInner);

function OpeningBookInner({
  moves = [],
  title = 'Opening book',
  loading = false,
  errorText,
  emptyText = 'No opening suggestions available.',
  selectedMove = null,
  onMovePress,
  testID,
}: OpeningBookProps) {
  const { theme } = useZoraTheme();
  const content = loading
    ? 'Loading opening suggestions…'
    : (errorText ?? (moves.length === 0 ? emptyText : undefined));
  return (
    <View
      accessibilityLabel={title}
      style={[
        styles.root,
        {
          borderColor: theme.semantics.neutral.border,
          backgroundColor: theme.semantics.neutral.surface,
        },
      ]}
      testID={testID}
    >
      <Text style={[styles.title, { color: theme.semantics.content.default }]}>{title}</Text>
      {content === undefined ? (
        moves.map((move) => (
          <Pressable
            accessibilityRole="button"
            key={move.uci ?? move.fen ?? move.san}
            onPress={() => onMovePress?.(move)}
            style={[
              styles.move,
              {
                backgroundColor:
                  selectedMove === move.san ||
                  selectedMove === move.uci ||
                  selectedMove === move.fen
                    ? theme.semantics.action.primary.softBg
                    : undefined,
              },
            ]}
          >
            <Text style={{ color: theme.semantics.content.default }}>
              {move.san}
              {move.name === undefined ? '' : ` · ${move.name}`}
            </Text>
          </Pressable>
        ))
      ) : (
        <Text style={{ color: theme.semantics.content.muted }}>{content}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { borderWidth: 1, gap: 8, padding: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  move: { padding: 8 },
});
