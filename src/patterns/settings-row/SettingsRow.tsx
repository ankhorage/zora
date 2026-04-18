import { Box, Text } from '@ankhorage/surface';
import React from 'react';

import { Card } from '../../components/card';
import type { SettingsRowProps } from './types';

export function SettingsRow({
  title,
  description,
  meta,
  control,
  onPress,
  disabled = false,
  testID,
}: SettingsRowProps) {
  return (
    <Card
      compact
      actions={control}
      description={description}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      title={title}
      tone="subtle"
    >
      {meta ? (
        <Box pt="xs">
          <Text tone="muted" variant="caption">
            {meta}
          </Text>
        </Box>
      ) : null}
    </Card>
  );
}
