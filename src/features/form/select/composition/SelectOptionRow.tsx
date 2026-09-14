import type { SelectOption, SelectProps } from '../../../../types/select';
import { Button } from '../../../button/public';

const SELECTED_ICON = { name: 'checkmark' } as const;

/*** Renders one Select option with shared web/native selection semantics. */
export function SelectOptionRow<TValue extends string>({
  interactionPolicy,
  onSelect,
  option,
  selected,
  testID,
}: SelectOptionRowProps<TValue>) {
  return (
    <Button
      color={selected ? 'primary' : 'neutral'}
      disabled={option.disabled}
      fullWidth
      interactionPolicy={interactionPolicy}
      onPress={() => onSelect(option.value)}
      testID={testID ? `${testID}-option-${option.value}` : undefined}
      trailingIcon={selected ? SELECTED_ICON : undefined}
      variant={selected ? 'soft' : 'ghost'}
    >
      {option.label}
    </Button>
  );
}

interface SelectOptionRowProps<TValue extends string> {
  interactionPolicy: SelectProps<TValue>['interactionPolicy'];
  onSelect: (value: TValue) => void;
  option: SelectOption<TValue>;
  selected: boolean;
  testID: string | undefined;
}
