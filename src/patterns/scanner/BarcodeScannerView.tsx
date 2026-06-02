import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '../../components/card';
import { Text } from '../../components/text';
import { Box, Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { CameraPermissionView } from './CameraPermissionView';
import { ScanOverlay } from './ScanOverlay';
import type { BarcodeScannerViewProps } from './types';

function BarcodeScannerViewInner({
  themeId: _themeId,
  mode: _mode,
  permissionStatus,
  camera,
  children,
  title = 'Scan barcode',
  description = 'Point the camera at a barcode to continue.',
  overlayTitle,
  overlayDescription,
  cornerLabel,
  requestPermissionLabel,
  deniedPermissionLabel,
  manualEntryLabel,
  onRequestPermission,
  onManualEntry,
  testID,
}: BarcodeScannerViewProps) {
  const { theme } = useZoraTheme();
  const viewportStyle = {
    backgroundColor: theme.semantics.surface.default,
  };
  const placeholderStyle = {
    backgroundColor: theme.semantics.surface.default,
  };

  if (permissionStatus !== 'granted') {
    return (
      <CameraPermissionView
        deniedLabel={deniedPermissionLabel}
        manualEntryLabel={manualEntryLabel}
        onManualEntry={onManualEntry}
        onRequestPermission={onRequestPermission}
        requestLabel={requestPermissionLabel}
        status={permissionStatus}
        testID={testID}
      />
    );
  }

  return (
    <Card
      compact
      description={description}
      eyebrow="Scanner"
      testID={testID}
      title={title}
      tone="subtle"
    >
      <Stack gap="m">
        <Box>
          <View style={[styles.viewport, viewportStyle]}>
            {camera ? (
              <View style={styles.cameraSlot}>{camera}</View>
            ) : (
              <View style={[styles.placeholder, placeholderStyle]} />
            )}
            <View pointerEvents="none" style={styles.overlay}>
              <ScanOverlay
                cornerLabel={cornerLabel}
                description={overlayDescription}
                title={overlayTitle}
              />
            </View>
          </View>
        </Box>
        {children ? <Box>{children}</Box> : null}
        <Text emphasis="muted" variant="caption">
          Native scanning belongs to an app adapter such as expo-camera. ZORA owns this visible
          scanner surface.
        </Text>
      </Stack>
    </Card>
  );
}

const styles = StyleSheet.create({
  viewport: {
    aspectRatio: 0.72,
    borderRadius: 28,
    minHeight: 360,
    overflow: 'hidden',
    position: 'relative',
  },
  cameraSlot: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  placeholder: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  overlay: {
    bottom: 24,
    left: 24,
    position: 'absolute',
    right: 24,
    top: 24,
  },
});

/***
 * Composed ZORA scanner shell for barcode scanning experiences.
 *
 * `BarcodeScannerView` is camera-adapter-neutral: pass an `expo-camera`, web,
 * or test camera element through `camera`; keep permission and fallback UI here.
 *
 */
export const BarcodeScannerView = withZoraThemeScope(BarcodeScannerViewInner);
