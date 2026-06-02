import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Badge } from '../../components/badge';
import { Text } from '../../components/text';
import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ScanOverlayProps } from './types';

function ScanOverlayInner({
  themeId: _themeId,
  mode: _mode,
  title = 'Align the barcode',
  description = 'Hold the barcode inside the frame. Scanning starts automatically.',
  cornerLabel = 'SCAN',
  testID,
}: ScanOverlayProps) {
  return (
    <Box testID={testID}>
      <Stack gap="m">
        <View accessibilityRole="image" style={styles.frame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <Badge color="primary">{cornerLabel}</Badge>
        </View>
        <Stack gap="xs">
          <Text align="center" variant="label" weight="semiBold">
            {title}
          </Text>
          <Text align="center" emphasis="muted" variant="bodySmall">
            {description}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    aspectRatio: 1.55,
    borderColor: 'rgba(255,255,255,0.36)',
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 180,
    overflow: 'hidden',
    position: 'relative',
  },
  corner: {
    borderColor: '#FFFFFF',
    height: 34,
    position: 'absolute',
    width: 34,
  },
  topLeft: {
    borderLeftWidth: 4,
    borderTopWidth: 4,
    left: 18,
    top: 18,
  },
  topRight: {
    borderRightWidth: 4,
    borderTopWidth: 4,
    right: 18,
    top: 18,
  },
  bottomLeft: {
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    bottom: 18,
    left: 18,
  },
  bottomRight: {
    borderBottomWidth: 4,
    borderRightWidth: 4,
    bottom: 18,
    right: 18,
  },
});

/***
 * Camera-agnostic scan frame overlay for barcode and QR scanning flows.
 *
 * `ScanOverlay` intentionally renders no native camera. Apps provide camera
 * capability separately while ZORA owns the visible scan affordance.
 *
 */
export const ScanOverlay = withZoraThemeScope(ScanOverlayInner);
