import type { SearchInputProps } from '../../../../../types/search-input';
import { withZoraThemeScope } from '../../../../theme/adapters/inbound/withZoraThemeScope';
import { TextInput, type TextInputTrailingAction } from '../../../text-input/public';

/*** Renders a search-focused text input with clear and submit behavior. */
export const SearchInput = withZoraThemeScope(SearchInputInner);

/*** Connects search semantics to the shared ZORA TextInput control. */
function SearchInputInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  value = '',
  onValueChange,
  placeholder = 'Search',
  onSubmit,
  onClear,
  clearable = true,
  size = 'l',
  disabled,
  readOnly,
  interactionPolicy,
}: SearchInputProps) {
  const passive = interactionPolicy === 'passive';
  const trailingAction: TextInputTrailingAction | undefined =
    clearable && value.length > 0
      ? {
          icon: { name: 'close-circle' },
          label: 'Clear search',
          onPress: () => {
            if (passive) return;
            onValueChange?.('');
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
