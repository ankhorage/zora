import React from 'react';

import { Button } from '../../components/button';
import { Card } from '../../components/card';
import { Text } from '../../components/text';
import { Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { CameraPermissionViewProps } from './types';

function resolvePermissionCopy(status: CameraPermissionViewProps['status']) {
  if (status === 'denied') {
    return {
      title: 'Camera permission needed',
      description:
        'Camera access is denied. Enable camera access in system settings or enter the barcode manually.',
    };
  }

  if (status === 'requesting') {
    return {
      title: 'Requesting camera access',
      description: 'Waiting for the system permission prompt.',
    };
  }

  return {
    title: 'Allow camera access',
    description:
      'Camera access is required to scan barcodes. You can also enter the barcode manually.',
  };
}

function CameraPermissionViewInner({
  themeId: _themeId,
  mode: _mode,
  status,
  title,
  description,
  requestLabel = 'Allow camera access',
  deniedLabel = 'Open settings',
  manualEntryLabel = 'Enter barcode manually',
  onRequestPermission,
  onManualEntry,
  requestButtonProps,
  manualEntryButtonProps,
  testID,
}: CameraPermissionViewProps) {
  const copy = resolvePermissionCopy(status);
  const primaryLabel = status === 'denied' ? deniedLabel : requestLabel;
  const handleRequestPermission = onRequestPermission
    ? () => {
        void onRequestPermission();
      }
    : undefined;
  const handleManualEntry = onManualEntry
    ? () => {
        void onManualEntry();
      }
    : undefined;

  return (
    <Card
      compact
      description={description ?? copy.description}
      eyebrow="Scanner permission"
      testID={testID}
      title={title ?? copy.title}
      tone="subtle"
    >
      <Stack gap="m">
        <Text emphasis="muted" variant="bodySmall">
          Permission state: {status}
        </Text>
        <Stack direction={{ base: 'column', md: 'row' }} gap="s">
          {handleRequestPermission ? (
            <Button
              color="primary"
              disabled={status === 'requesting'}
              onPress={handleRequestPermission}
              {...requestButtonProps}
            >
              {primaryLabel}
            </Button>
          ) : null}
          {handleManualEntry ? (
            <Button
              color="neutral"
              onPress={handleManualEntry}
              variant="soft"
              {...manualEntryButtonProps}
            >
              {manualEntryLabel}
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Card>
  );
}

/***
 * ZORA-owned camera permission state for scanner flows.
 *
 * Native permission APIs stay in app adapters. This component renders the
 * request, denied, requesting, and manual-entry surfaces consistently.
 *
 */
export const CameraPermissionView = withZoraThemeScope(CameraPermissionViewInner);
