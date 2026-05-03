import { Box, Heading, useTheme } from '@ankhorage/surface';
import React from 'react';

import { Card } from '../../components/card';
import { Text } from '../../components/text';
import type { PaletteItemProps } from './types';

export function PaletteItem({
  title,
  description,
  icon,
  badge,
  selected,
  disabled,
  onPress,
  testID,
}: PaletteItemProps) {
  const { theme } = useTheme();

  return (
    <Card
      compact
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      tone={selected ? 'default' : 'subtle'}
      style={
        selected
          ? {
              borderColor: theme.colors.primary,
              borderWidth: 2,
            }
          : undefined
      }
    >
      <Box p="xs" style={{ alignItems: 'center' }}>
        {icon ? <Box pb="s">{/* Icon spec here */}</Box> : null}
        <Heading level={5} align="center">
          {title}
        </Heading>
        {description ? (
          <Text align="center" tone="muted" variant="caption">
            {description}
          </Text>
        ) : null}
        {badge ? <Box pt="xs">{badge}</Box> : null}
      </Box>
    </Card>
  );
}
