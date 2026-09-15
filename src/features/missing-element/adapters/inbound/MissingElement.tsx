import React from 'react';
import { StyleSheet } from 'react-native';

import type { MissingElementProps } from '../../../../types/missing-element';
import { Badge } from '../../../badge/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Text } from '../../../typography/public';

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
    <View
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
      <View gap="xs">
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
      </View>
    </View>
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
