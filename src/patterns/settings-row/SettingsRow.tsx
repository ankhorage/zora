import React from 'react';

import { Card } from '../../features/card/public';
import { Box } from '../../features/layout/public';
import { Text } from '../../features/typography/public';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { SettingsRowProps } from './types';

function SettingsRowInner({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  meta,
  control,
  onPress,
  disabled = false,
  testID,
  interactionPolicy,
}: SettingsRowProps) {
  const isInteractive = Boolean(onPress) && !control;

  // Prevent nested interactive elements:
  // If a control is present (likely contains buttons), the row itself must not be clickable
  return (
    <Card
      compact
      actions={control}
      description={description}
      disabled={disabled}
      interactionPolicy={interactionPolicy}
      onPress={isInteractive ? onPress : undefined}
      testID={testID}
      title={title}
      tone="subtle"
    >
      {meta ? (
        <Box pt="xs">
          <Text emphasis="muted" variant="caption">
            {meta}
          </Text>
        </Box>
      ) : null}
    </Card>
  );
}

/***
 * Settings row pattern with title, description/meta, and optional trailing content.
 *
 
 */
export const SettingsRow = withZoraThemeScope(SettingsRowInner);
