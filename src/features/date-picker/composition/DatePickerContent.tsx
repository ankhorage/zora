import React from 'react';

import type { DatePickerProps } from '../../../types/date-picker';
import { Calendar } from '../../calendar/public';
import { Button } from '../../button/public';
import { View } from '../../layout/public';
import { PickerHeader } from '../../picker/composition/PickerHeader';
import { parseLocalDate } from '../utils/localDate';

/*** Hosts the shared compact Calendar inside the existing DatePicker overlay surfaces. */
export function DatePickerContent({
  description,
  interactionPolicy,
  label,
  maxDate,
  minDate,
  onDismiss,
  onSelect,
  testID,
  value,
}: DatePickerContentProps) {
  const resolvedMaxDate = React.useMemo(() => parseLocalDate(maxDate), [maxDate]);
  const resolvedMinDate = React.useMemo(() => parseLocalDate(minDate), [minDate]);
  const selectedDate = React.useMemo(() => parseLocalDate(value), [value]);

  return (
    <View gap="m" p="m" testID={testID ? `${testID}-content` : undefined}>
      <PickerHeader description={description} title={label ?? 'Choose date'} />
      <Calendar
        density="compact"
        interactionPolicy={interactionPolicy}
        maxDate={resolvedMaxDate}
        minDate={resolvedMinDate}
        onSelectedDateChange={onSelect}
        selectedDate={selectedDate ?? null}
        testID={testID}
      />
      <Button fullWidth interactionPolicy={interactionPolicy} onPress={onDismiss} variant="ghost">
        Cancel
      </Button>
    </View>
  );
}

interface DatePickerContentProps extends Pick<
  DatePickerProps,
  'description' | 'interactionPolicy' | 'label' | 'maxDate' | 'minDate' | 'testID' | 'value'
> {
  onDismiss: () => void;
  onSelect: (value: Date) => void;
}
