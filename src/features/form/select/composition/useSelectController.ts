import React from 'react';

import type { SelectProps } from '../../../../types/select';

/*** Resolves controlled or uncontrolled Select value state and the selected option. */
export function useSelectController<TValue extends string>(props: SelectProps<TValue>) {
  const { defaultValue, onValueChange, options, value: controlledValue } = props;
  const [localValue, setLocalValue] = React.useState<TValue | undefined>(defaultValue);
  const value = controlledValue ?? localValue;
  const selectedOption = options.find((option) => option.value === value);

  const select = React.useCallback(
    (nextValue: TValue) => {
      if (controlledValue === undefined) setLocalValue(nextValue);
      onValueChange?.(nextValue);
    },
    [controlledValue, onValueChange],
  );

  return { select, selectedOption, value } as const;
}
