import React from 'react';

import type {
  FormErrors,
  FormValues,
  UseFormControllerOptions,
  UseFormControllerResult,
} from './types';
import { validateFields } from './validation';

function createInitialValues<TName extends string>(
  fields: readonly { name: TName }[],
  initialValues: Partial<FormValues<TName>> | undefined,
): FormValues<TName> {
  const values = fields.reduce<Record<string, string>>((nextValues, field) => {
    nextValues[field.name] = initialValues?.[field.name] ?? '';
    return nextValues;
  }, {});

  return values as FormValues<TName>;
}

export function useFormController<TName extends string = string>({
  fields,
  initialValues,
  values: controlledValues,
  errors: externalErrors,
  onChange,
  onSubmit,
  validateOnChange = false,
}: UseFormControllerOptions<TName>): UseFormControllerResult<TName> {
  const initialValuesRef = React.useRef(createInitialValues(fields, initialValues));
  const [internalValues, setInternalValues] = React.useState<FormValues<TName>>(
    initialValuesRef.current,
  );
  const [validationErrors, setValidationErrors] = React.useState<FormErrors<TName>>({});

  const values = controlledValues ?? internalValues;
  const errors = React.useMemo(
    () => ({
      ...validationErrors,
      ...externalErrors,
    }),
    [externalErrors, validationErrors],
  );

  const setValues = React.useCallback(
    (nextValues: FormValues<TName>) => {
      if (!controlledValues) {
        setInternalValues(nextValues);
      }

      onChange?.(nextValues);
    },
    [controlledValues, onChange],
  );

  const validate = React.useCallback(() => {
    const result = validateFields(fields, values);
    setValidationErrors(result.errors);
    return result;
  }, [fields, values]);

  const setFieldValue = React.useCallback(
    (name: TName, value: string) => {
      const nextValues = {
        ...values,
        [name]: value,
      };

      setValues(nextValues);

      if (validateOnChange) {
        const result = validateFields(fields, nextValues);
        setValidationErrors(result.errors);
      }
    },
    [fields, setValues, validateOnChange, values],
  );

  const handleSubmit = React.useCallback(async () => {
    const result = validate();

    if (!result.valid) {
      return;
    }

    await onSubmit?.(values);
  }, [onSubmit, validate, values]);

  const reset = React.useCallback(() => {
    setValidationErrors({});
    setValues(initialValuesRef.current);
  }, [setValues]);

  return {
    values,
    errors,
    setValues,
    setFieldValue,
    validate,
    handleSubmit,
    reset,
  };
}
