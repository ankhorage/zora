import type { TimePickerProps } from '../../../types/time-picker';
import { Button } from '../../button/public';

/*** Renders the shared TimePicker trigger button for native and web hosts. */
export function TimePickerTrigger({
  disabled,
  formatTime,
  interactionPolicy,
  onPress,
  placeholder = 'Choose time',
  testID,
  value,
}: TimePickerTriggerProps) {
  const displayValue = value ? (formatTime ? formatTime(value) : value) : placeholder;

  return (
    <Button
      disabled={disabled}
      interactionPolicy={interactionPolicy}
      onPress={onPress}
      testID={testID ? `${testID}-trigger` : undefined}
      trailingIcon={{ name: 'chevron-down-outline' }}
      variant="outline"
    >
      {displayValue}
    </Button>
  );
}

interface TimePickerTriggerProps extends Pick<
  TimePickerProps,
  'disabled' | 'formatTime' | 'interactionPolicy' | 'placeholder' | 'testID' | 'value'
> {
  onPress: () => void;
}
