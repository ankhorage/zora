import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Text } from '../text';
import { resolveProgressFraction } from './resolveProgressFraction';
import { resolveProgressRingGeometry } from './resolveProgressRingGeometry';
import { type ProgressRingProps, resolveProgressRole } from './types';

function ProgressRingInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  accessibilityLabel = 'Progress',
  accessibilityValueText,
  centerLabel,
  centerValue,
  color = 'primary',
  max = 100,
  size = 120,
  testID,
  thickness = 10,
  trackColor = 'neutral',
  value,
}: ProgressRingProps) {
  const { theme } = useZoraTheme();
  const fraction = resolveProgressFraction({ max, value });
  const geometry = resolveProgressRingGeometry({ fraction, size, thickness });
  const progressRole = resolveProgressRole(theme, color);
  const trackRole = resolveProgressRole(theme, trackColor);
  const accessibilityMaximum = Number.isFinite(max) && max > 0 ? max : 1;
  const accessibilityValue = fraction * accessibilityMaximum;
  const valueText = accessibilityValueText ?? `${Math.round(fraction * 100)}%`;
  const segments = Array.from({ length: geometry.filledSegmentCount });

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityValue={{
        max: accessibilityMaximum,
        min: 0,
        now: accessibilityValue,
        text: valueText,
      }}
      accessible
      style={{ height: geometry.diameter, width: geometry.diameter }}
      testID={testID}
    >
      <View
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={styles.visual}
      >
        <View
          style={[
            styles.track,
            {
              borderColor: trackRole.softBg,
              borderRadius: geometry.diameter / 2,
              borderWidth: geometry.strokeWidth,
            },
          ]}
        />

        {segments.map((_, index) => (
          <View
            key={index}
            style={[
              styles.segmentLayer,
              { transform: [{ rotate: `${index * (360 / geometry.segmentCount)}deg` }] },
            ]}
          >
            <View
              style={{
                backgroundColor: progressRole.base,
                borderRadius: geometry.strokeWidth / 2,
                height: geometry.strokeWidth,
                left: (geometry.diameter - geometry.segmentWidth) / 2,
                position: 'absolute',
                top: 0,
                width: geometry.segmentWidth,
              }}
            />
          </View>
        ))}
      </View>

      {centerValue !== undefined || centerLabel !== undefined ? (
        <View
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={styles.center}
        >
          <Stack align="center" gap="xxs" px="s">
            {centerValue !== undefined ? (
              <Text align="center" variant="lead" weight="bold">
                {centerValue}
              </Text>
            ) : null}
            {centerLabel !== undefined ? (
              <Text align="center" emphasis="muted" numberOfLines={2} variant="caption">
                {centerLabel}
              </Text>
            ) : null}
          </Stack>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  segmentLayer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  track: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  visual: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

/***
 * Circular determinate progress with optional serializable center value and label content.
 */
export const ProgressRing = withZoraThemeScope(ProgressRingInner);
