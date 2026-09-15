import React from 'react';

import type { TimePickerProps } from '../../../../types/time-picker';
import { useBottomSheet } from '../../../bottom-sheet/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { TimePickerContent } from '../../composition/TimePickerContent';
import { TimePickerField } from '../../composition/TimePickerField';
import { TimePickerTrigger } from '../../composition/TimePickerTrigger';

/*** Renders TimePicker with native BottomSheet presentation. */
export const TimePicker = withZoraThemeScope(TimePickerInner);

/*** Connects the shared TimePicker field and content to the native BottomSheet host. */
function TimePickerInner({ themeId: _themeId, mode: _mode, ...props }: TimePickerProps) {
  const { dismiss, present } = useBottomSheet();

  const openPicker = React.useCallback(() => {
    if (props.interactionPolicy === 'passive') return;

    present({
      content: (
        <TimePickerContent
          description={props.description}
          formatTime={props.formatTime}
          interactionPolicy={props.interactionPolicy}
          label={props.label}
          maxTime={props.maxTime}
          minTime={props.minTime}
          onDismiss={dismiss}
          onSelect={(time) => {
            props.onValueChange?.(time);
            dismiss();
          }}
          stepMinutes={props.stepMinutes}
          testID={props.testID}
          value={props.value}
        />
      ),
    });
  }, [dismiss, present, props]);

  return (
    <TimePickerField {...props}>
      <TimePickerTrigger {...props} onPress={openPicker} />
    </TimePickerField>
  );
}
