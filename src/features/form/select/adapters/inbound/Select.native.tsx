import React from 'react';
import { type ListRenderItemInfo, StyleSheet } from 'react-native';

import type { SelectOption, SelectProps } from '../../../../../types/select';
import { BottomSheetFlatList, useBottomSheet } from '../../../../bottom-sheet/public';
import { withZoraThemeScope } from '../../../../theme/adapters/inbound/withZoraThemeScope';
import { SelectField } from '../../composition/SelectField';
import { SelectOptionRow } from '../../composition/SelectOptionRow';
import { SelectTrigger } from '../../composition/SelectTrigger';
import { useSelectController } from '../../composition/useSelectController';

const SELECT_SHEET_MAX_HEIGHT = 480;

/*** Renders Select with BottomSheetFlatList presentation on native platforms. */
export const Select = withZoraThemeScope(SelectInner);

/*** Connects shared Select state and controls to the native BottomSheet host. */
function SelectInner<TValue extends string = string>({
  themeId: _themeId,
  mode: _mode,
  ...props
}: SelectProps<TValue>) {
  const { dismiss, present } = useBottomSheet();
  const { select, selectedOption, value } = useSelectController(props);
  const passive = props.interactionPolicy === 'passive';
  const { disabled, interactionPolicy, options, readOnly, testID } = props;
  const listData = React.useMemo(() => [...options], [options]);

  const handleSelect = React.useCallback(
    (nextValue: TValue) => {
      select(nextValue);
      dismiss();
    },
    [dismiss, select],
  );

  const renderOption = React.useCallback(
    ({ item }: ListRenderItemInfo<SelectOption<TValue>>) => (
      <SelectOptionRow
        interactionPolicy={interactionPolicy}
        onSelect={handleSelect}
        option={item}
        selected={value === item.value}
        testID={testID}
      />
    ),
    [handleSelect, interactionPolicy, testID, value],
  );

  const openSelect = React.useCallback(() => {
    if (disabled || readOnly || passive) return;

    present({
      contentMode: 'direct',
      maxDynamicContentSize: SELECT_SHEET_MAX_HEIGHT,
      content: (
        <BottomSheetFlatList
          contentContainerStyle={styles.listContent}
          data={listData}
          keyExtractor={(item) => item.value}
          renderItem={renderOption}
        />
      ),
    });
  }, [disabled, listData, passive, present, readOnly, renderOption]);

  return (
    <SelectField props={props}>
      <SelectTrigger displayLabel={selectedOption?.label} onPress={openSelect} props={props} />
    </SelectField>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
});
