import type React from 'react';

import type { DatePickerProps } from '../../../types/date-picker';
import { Button } from '../../button/public';
import { parseLocalDate } from '../utils/localDate';

/*** Renders the shared DatePicker trigger button for native and web hosts. */
export function DatePickerTrigger({
  disabled,
  formatDate,
  interactionPolicy,
  onPress,
  placeholder = 'Choose date',
  testID,
  value,
}: DatePickerTriggerProps) {
  const displayValue = value
    ? formatDate
      ? formatDate(value)
      : formatDefaultDate(value)
    : placeholder;

  return (
    <Button
      disabled={disabled}
      interactionPolicy={interactionPolicy}
      onPress={onPress}
      testID={testID ? `${testID}-trigger` : undefined}
      trailingIcon={{ name: 'calendar-outline' }}
      variant="outline"
    >
      {displayValue}
    </Button>
  );
}

interface DatePickerTriggerProps extends Pick<
  DatePickerProps,
  'disabled' | 'formatDate' | 'interactionPolicy' | 'placeholder' | 'testID' | 'value'
> {
  onPress: () => void;
}

/*** Formats a date using the current platform locale when no formatter is supplied. */
function formatDefaultDate(value: string): React.ReactNode {
  return parseLocalDate(value)?.toLocaleDateString() ?? value;
}
