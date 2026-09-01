import React from 'react';
import { StyleSheet } from 'react-native';

import { Badge } from '../../components/badge';
import { Text } from '../../components/text';
import { Box, Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { MissingElementProps } from './types';

/***
 * Renders the visible, non-interactive body of a draft missing-element marker.
 */
function MissingElementInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  requestedCapability,
  reason,
  evidenceId,
  minimumWidth,
  minimumHeight,
  testID,
}: MissingElementProps) {
  const { theme } = useZoraTheme();
  const accessibilityLabel = `Missing element: ${requestedCapability}. ${reason}`;

  return (
    <Box
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="text"
      accessible
      bg={theme.semantics.warning.softBg}
      borderColor={theme.semantics.warning.base}
      borderWidth={1}
      minHeight={minimumHeight}
      minWidth={minimumWidth}
      p="m"
      radius="m"
      style={styles.root}
      testID={testID}
    >
      <Stack gap="xs">
        <Badge color="warning">Missing element</Badge>
        <Text variant="label" weight="semiBold">
          {requestedCapability}
        </Text>
        <Text emphasis="muted" variant="bodySmall">
          {reason}
        </Text>
        {evidenceId ? (
          <Text emphasis="subtle" variant="caption">
            Evidence: {evidenceId}
          </Text>
        ) : null}
      </Stack>
    </Box>
  );
}

const styles = StyleSheet.create({
  root: {
    borderStyle: 'dashed',
  },
});

/***
 * Draft-only marker that preserves an unsupported manifest region without faking its capability.
 *
 * `MissingElement` is intentionally non-interactive and release-blocking in component metadata.
 * Replace it with a released semantic ZORA element before publishing a production template.
 */
export const MissingElement = withZoraThemeScope(MissingElementInner);
