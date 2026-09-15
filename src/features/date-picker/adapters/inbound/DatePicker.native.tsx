import React from 'react';

import type { DatePickerProps } from '../../../../types/date-picker';
import { useBottomSheet } from '../../../bottom-sheet/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { DatePickerContent } from '../../composition/DatePickerContent';
import { DatePickerField } from '../../composition/DatePickerField';
import { DatePickerTrigger } from '../../composition/DatePickerTrigger';
import { formatLocalDate } from '../../utils/localDate';

/*** Renders DatePicker with native BottomSheet presentation. */
export const DatePicker = withZoraThemeScope(DatePickerInner);

/*** Connects the shared DatePicker field and content to the native BottomSheet host. */
function DatePickerInner({ themeId: _themeId, mode: _mode, ...props }: DatePickerProps) {
  const { dismiss, present } = useBottomSheet();

  const openPicker = React.useCallback(() => {
    if (props.interactionPolicy === 'passive') return;

    present({
      content: (
        <DatePickerContent
          description={props.description}
          interactionPolicy={props.interactionPolicy}
          label={props.label}
          maxDate={props.maxDate}
          minDate={props.minDate}
          onDismiss={dismiss}
          onSelect={(date) => {
            props.onValueChange?.(formatLocalDate(date));
            dismiss();
          }}
          testID={props.testID}
          value={props.value}
        />
      ),
    });
  }, [dismiss, present, props]);

  return (
    <DatePickerField {...props}>
      <DatePickerTrigger {...props} onPress={openPicker} />
    </DatePickerField>
  );
}
