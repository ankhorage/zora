import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { GridLineOverlayProps } from '../../../../types/grid-rulers';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { resolveGridRulerMarks } from '../../application/resolveGridRulerMarks';

/*** Renders visible world-grid lines and explicit guides without owning viewport interaction. */
function GridLineOverlayInner({
  accessibilityLabel = 'Grid guides',
  guides = [],
  testID,
  viewport,
  xTickSource,
  yTickSource,
}: GridLineOverlayProps) {
  const { theme } = useZoraTheme();
  const xMarks = xTickSource ? resolveGridRulerMarks(viewport, 'x', xTickSource) : [];
  const yMarks = yTickSource ? resolveGridRulerMarks(viewport, 'y', yTickSource) : [];

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessible
      pointerEvents="none"
      style={[styles.overlay, { height: viewport.height, width: viewport.width }]}
      testID={testID}
    >
      {xMarks.map((mark, index) => (
        <View
          key={`x-${mark.position}-${index}`}
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.vertical,
            {
              backgroundColor: theme.semantics.neutral.divider,
              left: mark.position,
              opacity: mark.level === 'major' ? 0.5 : 0.25,
            },
          ]}
        />
      ))}
      {yMarks.map((mark, index) => (
        <View
          key={`y-${mark.position}-${index}`}
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.horizontal,
            {
              backgroundColor: theme.semantics.neutral.divider,
              opacity: mark.level === 'major' ? 0.5 : 0.25,
              top: mark.position,
            },
          ]}
        />
      ))}
      {guides.map((guide) => (
        <View
          key={guide.id}
          accessibilityLabel={guide.label ?? `Guide ${guide.id}`}
          style={[
            guide.axis === 'x' ? styles.vertical : styles.horizontal,
            guide.axis === 'x'
              ? {
                  backgroundColor: theme.colors.primary,
                  left: (guide.position - viewport.offsetX) * viewport.pixelsPerUnitX,
                }
              : {
                  backgroundColor: theme.colors.primary,
                  top: (guide.position - viewport.offsetY) * viewport.pixelsPerUnitY,
                },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  horizontal: { height: 1, left: 0, position: 'absolute', right: 0 },
  overlay: { overflow: 'hidden', position: 'absolute' },
  vertical: { bottom: 0, position: 'absolute', top: 0, width: 1 },
});

/*** A reusable passive world-space grid and guide overlay. */
export const GridLineOverlay = withZoraThemeScope(GridLineOverlayInner);
