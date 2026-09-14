import React from 'react';
import { StyleSheet } from 'react-native';

import { withZoraThemeScope } from '../../../../../theme/withZoraThemeScope';
import type { SelectProps } from '../../../../../types/select';
import { BottomSheetFlatList, useBottomSheet } from '../../../../bottom-sheet/public';
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
  const controller = useSelectController(props);

  const openSelect = React.useCallback(() => {
    if (props.disabled || props.readOnly || props.interactionPolicy === 'passive') return;

    present({
      contentMode: 'direct',
      maxDynamicContentSize: SELECT_SHEET_MAX_HEIGHT,
      content: (
        <BottomSheetFlatList
          contentContainerStyle={styles.listContent}
          data={[...props.options]}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <SelectOptionRow
              interactionPolicy={props.interactionPolicy}
              onSelect={(value) => {
                controller.select(value);
                dismiss();
              }}
              option={item}
              selected={controller.value === item.value}
              testID={props.testID}
            />
          )}
        />
      ),
    });
  }, [controller, dismiss, present, props]);

  return (
    <SelectField props={props}>
      <SelectTrigger
        displayLabel={controller.selectedOption?.label}
        onPress={openSelect}
        props={props}
      />
    </SelectField>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
});
