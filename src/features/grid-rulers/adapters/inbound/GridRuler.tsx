import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { GridRulerProps } from '../../../../types/grid-rulers';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { resolveGridRulerMarks } from '../../application/resolveGridRulerMarks';

/*** Renders a passive axis ruler from published grid-view tick geometry. */
function GridRulerInner({
  accessibilityLabel,
  axis,
  direction = 'ltr',
  formatLabel,
  offset = 0,
  position = 'start',
  testID,
  thickness = 24,
  tickSource,
  viewport,
}: GridRulerProps) {
  const { theme } = useZoraTheme();
  const marks = resolveGridRulerMarks(viewport, axis, tickSource, formatLabel);
  const horizontal = axis === 'x';
  const size = horizontal ? viewport.width : viewport.height;
  const label = accessibilityLabel ?? `${horizontal ? 'Horizontal' : 'Vertical'} ruler`;

  return (
    <View
      accessibilityLabel={label}
      accessible
      pointerEvents="none"
      style={[
        styles.ruler,
        horizontal ? { height: thickness, width: size } : { height: size, width: thickness },
        position === 'start'
          ? horizontal
            ? { top: offset }
            : { left: offset }
          : horizontal
            ? { bottom: offset }
            : { right: offset },
      ]}
      testID={testID}
    >
      {marks.map((mark, index) => {
        const coordinate = direction === 'rtl' && horizontal ? size - mark.position : mark.position;
        const tickStyle = horizontal
          ? {
              height: mark.level === 'major' ? thickness : thickness / 2,
              left: coordinate,
              top: 0,
              width: 1,
            }
          : {
              height: 1,
              left: 0,
              top: coordinate,
              width: mark.level === 'major' ? thickness : thickness / 2,
            };
        return (
          <React.Fragment key={`${mark.position}-${index}`}>
            <View
              importantForAccessibility="no-hide-descendants"
              style={[styles.tick, { backgroundColor: theme.semantics.neutral.divider }, tickStyle]}
            />
            {mark.label !== undefined ? (
              <Text
                importantForAccessibility="no-hide-descendants"
                numberOfLines={1}
                style={[
                  styles.label,
                  { color: theme.semantics.neutral.textMuted },
                  horizontal ? { left: coordinate + 3, top: 2 } : { left: 3, top: coordinate + 2 },
                ]}
              >
                {mark.label}
              </Text>
            ) : null}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 10, position: 'absolute' },
  ruler: { overflow: 'hidden', position: 'absolute' },
  tick: { position: 'absolute' },
});

/*** A reusable passive horizontal or vertical world-space ruler. */
export const GridRuler = withZoraThemeScope(GridRulerInner);
