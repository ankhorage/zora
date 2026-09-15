import React from 'react';

import type { PaletteItemProps } from '../../../../types/palette-item';
import { Card } from '../../../card/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Heading } from '../../../typography/public';
import { Text } from '../../../typography/public';

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
      <View p="xs" style={{ alignItems: 'center' }}>
        {icon ? <View pb="s">{/* Icon spec here */}</View> : null}
        <Heading level={5} align="center">
          {title}
        </Heading>
        {description ? (
          <Text align="center" emphasis="muted" variant="caption">
            {description}
          </Text>
        ) : null}
        {badge ? <View pt="xs">{badge}</View> : null}
      </View>
    </Card>
  );
}

/***
 * Tile item pattern for palettes and option grids.
 *
 
 */
export const PaletteItem = withZoraThemeScope(PaletteItemInner);
