import { Popover } from '@ankhorage/surface';
import React from 'react';

import type { DatePickerProps } from '../../../../types/date-picker';
import { Surface } from '../../../surface/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { DatePickerContent } from '../../composition/DatePickerContent';
import { DatePickerField } from '../../composition/DatePickerField';
import { DatePickerTrigger } from '../../composition/DatePickerTrigger';
import { formatLocalDate } from '../../utils/localDate';

/*** Renders DatePicker with anchored web Popover presentation. */
export const DatePicker = withZoraThemeScope(DatePickerInner);

/*** Connects the shared DatePicker field and content to the web Popover host. */
function DatePickerInner({ themeId: _themeId, mode: _mode, ...props }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DatePickerField {...props}>
      <Popover
        anchor={({ toggle }) => <DatePickerTrigger {...props} onPress={toggle} />}
        interactionPolicy={props.interactionPolicy}
        onOpenChange={setOpen}
        open={open}
        placement="bottom-start"
        testID={props.testID ? `${props.testID}-popover` : undefined}
      >
        <Surface variant="raised">
          <DatePickerContent
            description={props.description}
            interactionPolicy={props.interactionPolicy}
            label={props.label}
            maxDate={props.maxDate}
            minDate={props.minDate}
            onDismiss={() => setOpen(false)}
            onSelect={(date) => {
              props.onValueChange?.(formatLocalDate(date));
              setOpen(false);
            }}
            testID={props.testID}
            value={props.value}
          />
        </Surface>
      </Popover>
    </DatePickerField>
  );
}
