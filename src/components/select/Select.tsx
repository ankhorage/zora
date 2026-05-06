import { Picker } from '@react-native-picker/picker';
import React from 'react';

import { Box } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { SelectProps } from './types';

function SelectInner<TValue extends string = string>({
  themeId: _themeId,
  mode: _mode,
  value,
  options,
  onValueChange,
  disabled,
  invalid,
  testID,
}: SelectProps<TValue>) {
  const { theme } = useZoraTheme();

  return (
    <Box
      bg="surface"
      borderColor={invalid ? theme.colors.error : theme.colors.border}
      borderWidth={1}
      opacity={disabled ? 0.5 : 1}
      radius="m"
      testID={testID}
    >
      <Picker
        enabled={!disabled}
        onValueChange={(itemValue) => onValueChange(itemValue)}
        selectedValue={value}
        style={{
          height: 44,
          width: '100%',
          backgroundColor: 'transparent',
          color: theme.colors.text,
          borderWidth: 0,
        }}
      >
        {options.map((option) => (
          <Picker.Item
            key={option.value}
            enabled={!option.disabled}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>
    </Box>
  );
}

export const Select = withZoraThemeScope(SelectInner);
