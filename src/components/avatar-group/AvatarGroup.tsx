import React from 'react';

import { Box, Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Avatar } from '../avatar';
import type { AvatarGroupItem, AvatarGroupProps } from './types';

function defaultOverflowLabel(overflowCount: number): string {
  return `+${overflowCount}`;
}

function AvatarGroupInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  items,
  max = 4,
  size = 's',
  shape = 'circle',
  overflowLabel = defaultOverflowLabel,
}: AvatarGroupProps) {
  const { theme } = useZoraTheme();

  const visibleItems = items.slice(0, max);
  const overflowCount = Math.max(0, items.length - visibleItems.length);
  const overlap =
    size === 'xs' ? 8 : size === 's' ? 10 : size === 'm' ? 12 : size === 'l' ? 14 : 16;
  const borderColor = theme.semantics.surface.default;

  const renderItem = (item: AvatarGroupItem, index: number) => (
    <Box
      key={item.id ?? `${index}`}
      ml={index === 0 ? 0 : -overlap}
      radius="full"
      borderWidth={2}
      borderColor={borderColor}
    >
      <Avatar
        iconFallback={item.iconFallback}
        initials={item.initials}
        label={item.label}
        name={item.name}
        shape={shape}
        size={size}
        source={item.source}
        tone={item.tone}
      />
    </Box>
  );

  return (
    <Stack align="center" direction="row" testID={testID} wrap="nowrap">
      {visibleItems.map(renderItem)}
      {overflowCount > 0 ? (
        <Box
          ml={visibleItems.length === 0 ? 0 : -overlap}
          radius="full"
          borderWidth={2}
          borderColor={borderColor}
        >
          <Avatar
            initials={overflowLabel(overflowCount)}
            size={size}
            shape={shape}
            tone="neutral"
          />
        </Box>
      ) : null}
    </Stack>
  );
}

export const AvatarGroup = withZoraThemeScope(AvatarGroupInner);
