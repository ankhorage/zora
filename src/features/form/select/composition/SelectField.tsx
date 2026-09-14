import { Field } from '@ankhorage/surface';
import type React from 'react';

import type { SelectProps } from '../../../../types/select';

/*** Wraps Select presentation in the canonical Surface form-field semantics. */
export function SelectField<TValue extends string>({ children, props }: SelectFieldProps<TValue>) {
  return (
    <Field
      disabled={props.disabled}
      errorText={props.errorText}
      helperText={props.helperText}
      invalid={props.invalid}
      label={props.label}
      readOnly={props.readOnly}
      required={props.required}
      testID={props.testID ? `${props.testID}-field` : undefined}
    >
      {children}
    </Field>
  );
}

interface SelectFieldProps<TValue extends string> {
  children: React.ReactNode;
  props: SelectProps<TValue>;
}
