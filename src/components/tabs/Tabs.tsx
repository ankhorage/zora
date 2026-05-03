import { Box, Stack, useTheme } from '@ankhorage/surface';
import React from 'react';

import { Button } from '../button';
import { Text } from '../text';
import type { TabItem, TabsProps } from './types';

export function Tabs<TValue extends string = string>({
  value,
  items,
  onValueChange,
  variant = 'underline',
  size = 'm',
  disabled: tabsDisabled,
  testID,
}: TabsProps<TValue>) {
  const { theme } = useTheme();

  const renderTab = (item: TabItem<TValue>) => {
    const isActive = item.value === value;
    const isDisabled = tabsDisabled ?? item.disabled;

    if (variant === 'segmented') {
      return (
        <Button
          key={item.value}
          emphasis={isActive ? 'solid' : 'ghost'}
          tone="neutral"
          size={size}
          disabled={isDisabled}
          onPress={() => onValueChange(item.value)}
          leadingIcon={item.icon}
          testID={item.testID}
        >
          {item.label}
          {item.badge}
        </Button>
      );
    }

    if (variant === 'pill') {
      return (
        <Button
          key={item.value}
          emphasis={isActive ? 'soft' : 'ghost'}
          tone={isActive ? 'primary' : 'neutral'}
          size={size}
          disabled={isDisabled}
          onPress={() => onValueChange(item.value)}
          leadingIcon={item.icon}
          testID={item.testID}
        >
          {item.label}
          {item.badge}
        </Button>
      );
    }

    // Default: 'underline'
    return (
      <Box
        key={item.value}
        borderColor={isActive ? theme.colors.primary : 'transparent'}
        pb="xs"
        style={{
          borderBottomWidth: 2,
        }}
      >
        <Button
          emphasis="ghost"
          tone="neutral"
          size={size}
          disabled={isDisabled}
          onPress={() => onValueChange(item.value)}
          leadingIcon={item.icon}
          testID={item.testID}
        >
          <Text tone={isActive ? 'primary' : 'muted'} weight={isActive ? 'semiBold' : 'regular'}>
            {item.label}
          </Text>
          {item.badge}
        </Button>
      </Box>
    );
  };

  return (
    <Stack
      direction="row"
      gap={variant === 'segmented' ? 'none' : 'm'}
      align="center"
      testID={testID}
      p={variant === 'segmented' ? 'xxs' : 'none'}
      bg={variant === 'segmented' ? 'subtle' : 'transparent'}
      radius={variant === 'segmented' ? 'm' : 'none'}
    >
      {items.map(renderTab)}
    </Stack>
  );
}
