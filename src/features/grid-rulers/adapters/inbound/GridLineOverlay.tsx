import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { GridLineOverlayProps } from '../../../../types/grid-rulers';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { projectGridRulerPosition } from '../../application/projectGridRulerPosition';
import { resolveGridRulerMarks } from '../../application/resolveGridRulerMarks';

/*** Renders visible world-grid lines and explicit guides without owning viewport interaction. */
function GridLineOverlayInner({
  accessibilityLabel = 'Grid guides',
  direction = 'ltr',
  guides = [],
  testID,
  viewport,
  xTickSource,
  yTickSource,
}: GridLineOverlayProps) {
  const { theme } = useZoraTheme();
  const xMarks = xTickSource
    ? resolveGridRulerMarks(viewport, 'x', xTickSource, undefined, direction)
    : [];
  const yMarks = yTickSource ? resolveGridRulerMarks(viewport, 'y', yTickSource) : [];
  const visibleGuides = resolveVisibleGridGuides(guides, viewport, direction);

  return (
    <View
      accessible={false}
      importantForAccessibility="no"
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
          testID={testID === undefined ? undefined : `${testID}-x-line-${index}`}
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
          testID={testID === undefined ? undefined : `${testID}-y-line-${index}`}
        />
      ))}
      {visibleGuides.map(({ guide, position }) => (
        <View
          key={guide.id}
          accessibilityLabel={createGuideAccessibilityLabel(accessibilityLabel, guide)}
          accessibilityRole="text"
          accessible
          style={[
            guide.axis === 'x' ? styles.vertical : styles.horizontal,
            guide.axis === 'x'
              ? {
                  backgroundColor: theme.colors.primary,
                  left: position,
                }
              : {
                  backgroundColor: theme.colors.primary,
                  top: position,
                },
          ]}
          testID={testID === undefined ? undefined : `${testID}-guide-${guide.id}`}
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

/*** Selects finite guides whose shared world-to-visual projection falls inside the viewport. */
function resolveVisibleGridGuides(
  guides: NonNullable<GridLineOverlayProps['guides']>,
  viewport: GridLineOverlayProps['viewport'],
  direction: NonNullable<GridLineOverlayProps['direction']>,
) {
  return guides.flatMap((guide) => {
    if (!Number.isFinite(guide.position)) return [];

    const position = projectGridRulerPosition(viewport, guide.axis, guide.position, direction);
    const size = guide.axis === 'x' ? viewport.width : viewport.height;

    return Number.isFinite(position) && position >= 0 && position <= size
      ? [{ guide, position }]
      : [];
  });
}

/*** Gives each visible guide an independent screen-reader identity with its stable world position. */
function createGuideAccessibilityLabel(
  overlayLabel: string,
  guide: NonNullable<GridLineOverlayProps['guides']>[number],
): string {
  return `${overlayLabel}: ${guide.label ?? `Guide ${guide.id}`} at ${guide.position}`;
}

/*** A reusable passive world-space grid and guide overlay. */
export const GridLineOverlay = withZoraThemeScope(GridLineOverlayInner);
