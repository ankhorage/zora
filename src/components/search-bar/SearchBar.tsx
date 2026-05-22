import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Input, type InputTrailingAction } from '../input';
import type { SearchBarProps } from './types';

function SearchBarInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  value,
  onValueChange,
  placeholder = 'Search',
  onSubmit,
  onClear,
  clearable = true,
  size = 'l',
  disabled,
  readOnly,
}: SearchBarProps) {
  const trailingAction: InputTrailingAction | undefined =
    clearable && value.length > 0
      ? {
          icon: { name: 'close-circle' },
          label: 'Clear search',
          onPress: () => {
            onValueChange('');
            onClear?.();
          },
        }
      : undefined;

  return (
    <Input
      disabled={disabled}
      leadingIcon={{ name: 'search-outline' }}
      onChangeText={onValueChange}
      onSubmitEditing={onSubmit ? () => onSubmit(value) : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      returnKeyType="search"
      size={size}
      testID={testID}
      trailingAction={trailingAction}
      value={value}
    />
  );
}

/***
 * Search input with leading icon and optional trailing action.
 *
 * @readme
 */
export const SearchBar = withZoraThemeScope(SearchBarInner);
