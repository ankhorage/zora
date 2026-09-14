import type { SelectProps } from '../../../../types/select';
import { Button } from '../../../button/public';

const SELECT_CHEVRON_ICON = { name: 'chevron-down' } as const;

/*** Renders the shared Select trigger with the resolved option label or placeholder. */
export function SelectTrigger<TValue extends string>({
  displayLabel,
  onPress,
  props,
}: SelectTriggerProps<TValue>) {
  return (
    <Button
      color={props.invalid ? 'danger' : 'neutral'}
      disabled={props.disabled}
      fullWidth
      interactionPolicy={props.interactionPolicy}
      onPress={props.readOnly ? undefined : onPress}
      testID={props.testID ? `${props.testID}-trigger` : undefined}
      trailingIcon={SELECT_CHEVRON_ICON}
      variant="outline"
    >
      {displayLabel ?? props.placeholder ?? 'Select'}
    </Button>
  );
}

interface SelectTriggerProps<TValue extends string> {
  displayLabel: string | undefined;
  onPress: () => void;
  props: SelectProps<TValue>;
}
