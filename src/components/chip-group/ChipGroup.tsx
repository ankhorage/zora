import React from 'react';

import { Inline } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Chip } from '../chip';
import type { ChipGroupItem, ChipGroupProps } from './types';

function hasValue<TValue extends string>(values: readonly TValue[], value: TValue): boolean {
  return values.includes(value);
}

function toggleValue<TValue extends string>(values: readonly TValue[], value: TValue): TValue[] {
  return hasValue(values, value) ? values.filter((item) => item !== value) : [...values, value];
}

function ChipGroupInner<TValue extends string = string>({
  themeId: _themeId,
  mode: _mode,
  testID,
  items,
  value,
  onValueChange,
  multiple,
  color = 'neutral',
  size = 's',
  wrap = true,
  disabled,
}: ChipGroupProps<TValue>) {
  const renderChip = (item: ChipGroupItem<TValue>) => {
    const itemDisabled = disabled ?? item.disabled ?? false;
    const isSelected = Array.isArray(value) ? hasValue(value, item.value) : value === item.value;

    const handlePress = () => {
      if (multiple) {
        const next = toggleValue(value, item.value);
        onValueChange(next);
        return;
      }

      onValueChange(item.value);
    };

    return (
      <Chip
        key={item.value}
        disabled={itemDisabled}
        icon={item.icon}
        onPress={handlePress}
        selected={isSelected}
        size={size}
        testID={item.testID}
        color={color}
      >
        {item.label}
      </Chip>
    );
  };

  return (
    <Inline align="center" gap="s" testID={testID} wrap={wrap ? 'wrap' : 'nowrap'}>
      {items.map(renderChip)}
    </Inline>
  );
}

export const ChipGroup = withZoraThemeScope(ChipGroupInner);
