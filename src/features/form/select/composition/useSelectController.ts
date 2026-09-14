import React from 'react';

import type { SelectProps } from '../../../../types/select';

/*** Resolves controlled or uncontrolled Select value state and the selected option. */
export function useSelectController<TValue extends string>(props: SelectProps<TValue>) {
  const [localValue, setLocalValue] = React.useState<TValue | undefined>(props.defaultValue);
  const value = props.value ?? localValue;
  const selectedOption = props.options.find((option) => option.value === value);

  const select = React.useCallback(
    (nextValue: TValue) => {
      if (props.value === undefined) setLocalValue(nextValue);
      props.onValueChange?.(nextValue);
    },
    [props.onValueChange, props.value],
  );

  return { select, selectedOption, value } as const;
}
