import type {
  FormFieldConfig,
  FormValidationErrors,
  FormValidationResult,
  FormValues,
  ValidationRule,
} from './types';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function hasRequiredRule(rules: readonly ValidationRule[] | undefined): boolean {
  return rules?.some((rule) => rule.kind === 'required') ?? false;
}

export function validateValue(
  value: string,
  rules: readonly ValidationRule[] | undefined,
): string | undefined {
  if (!rules?.length) {
    return undefined;
  }

  for (const rule of rules) {
    const normalizedValue = value.trim();

    if (rule.kind === 'required' && normalizedValue.length === 0) {
      return rule.message ?? 'This field is required.';
    }

    if (
      rule.kind === 'email' &&
      normalizedValue.length > 0 &&
      !emailPattern.test(normalizedValue)
    ) {
      return rule.message ?? 'Enter a valid email address.';
    }

    if (rule.kind === 'minLength' && value.length < rule.value) {
      return rule.message ?? `Enter at least ${rule.value} characters.`;
    }

    if (rule.kind === 'pattern') {
      try {
        const pattern = new RegExp(rule.value);

        if (normalizedValue.length > 0 && !pattern.test(value)) {
          return rule.message ?? 'Enter a valid value.';
        }
      } catch {
        return rule.message ?? 'Enter a valid value.';
      }
    }
  }

  return undefined;
}

export function validateField<TName extends string>(
  field: FormFieldConfig<TName>,
  values: FormValues<TName>,
): string | undefined {
  return validateValue(values[field.name], field.rules);
}

export function validateFields<TName extends string>(
  fields: readonly FormFieldConfig<TName>[],
  values: FormValues<TName>,
): FormValidationResult<TName> {
  const errors: FormValidationErrors<TName> = {};

  for (const field of fields) {
    const error = validateField(field, values);

    if (error) {
      errors[field.name] = error;
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
}
