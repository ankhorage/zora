import React from 'react';

import { Card } from '../../components/card';
import { Heading } from '../../components/heading';
import { Text } from '../../components/text';
import { Box } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { PaletteItemProps } from './types';

function PaletteItemInner({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  icon,
  badge,
  selected,
  disabled,
  onPress,
  testID,
}: PaletteItemProps) {
  const { theme } = useZoraTheme();

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

export const PaletteItem = withZoraThemeScope(PaletteItemInner);
