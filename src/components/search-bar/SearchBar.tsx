import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { TextInput, type TextInputTrailingAction } from '../../features/form/text-input/public';
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
  interactionPolicy,
}: SearchBarProps) {
  const passive = interactionPolicy === 'passive';

  const trailingAction: TextInputTrailingAction | undefined =
    clearable && value.length > 0
      ? {
          icon: { name: 'close-circle' },
          label: 'Clear search',
          onPress: () => {
            if (passive) return;

            onValueChange('');
            onClear?.();
          },
        }
      : undefined;

  return (
    <TextInput
      disabled={disabled}
      interactionPolicy={interactionPolicy}
      leadingIcon={{ name: 'search-outline' }}
      onChangeText={onValueChange}
      onSubmitEditing={onSubmit ? (passive ? undefined : () => onSubmit(value)) : undefined}
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
 */
export const SearchBar = withZoraThemeScope(SearchBarInner);
