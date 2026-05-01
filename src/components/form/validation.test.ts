import { describe, expect, test } from 'bun:test';

import type { FormFieldConfig, FormValues } from './types';
import { validateFields, validateValue } from './validation';

describe('form validation', () => {
  test('validates required fields', () => {
    expect(validateValue('', [{ kind: 'required' }])).toBe('This field is required.');
    expect(validateValue('   ', [{ kind: 'required', message: 'Required' }])).toBe('Required');
    expect(validateValue('value', [{ kind: 'required' }])).toBeUndefined();
  });

  test('validates email fields', () => {
    expect(validateValue('not-email', [{ kind: 'email' }])).toBe('Enter a valid email address.');
    expect(validateValue('person@example.com', [{ kind: 'email' }])).toBeUndefined();
  });

  test('validates minimum length fields', () => {
    expect(validateValue('short', [{ kind: 'minLength', value: 8 }])).toBe(
      'Enter at least 8 characters.',
    );
    expect(validateValue('long-enough', [{ kind: 'minLength', value: 8 }])).toBeUndefined();
  });

  test('validates pattern fields', () => {
    expect(validateValue('abc', [{ kind: 'pattern', value: '^\\d+$' }])).toBe(
      'Enter a valid value.',
    );
    expect(validateValue('123', [{ kind: 'pattern', value: '^\\d+$' }])).toBeUndefined();
  });

  test('returns the first failed rule per field', () => {
    expect(validateValue('', [{ kind: 'required' }, { kind: 'email' }])).toBe(
      'This field is required.',
    );
  });

  test('validates multiple fields', () => {
    type FieldName = 'email' | 'password';
    const fields: readonly FormFieldConfig<FieldName>[] = [
      {
        name: 'email',
        label: 'Email',
        rules: [{ kind: 'required' }, { kind: 'email' }],
      },
      {
        name: 'password',
        label: 'Password',
        rules: [{ kind: 'required' }, { kind: 'minLength', value: 8 }],
      },
    ];
    const values: FormValues<FieldName> = {
      email: 'person@example.com',
      password: 'short',
    };

    expect(validateFields(fields, values)).toEqual({
      errors: {
        password: 'Enter at least 8 characters.',
      },
      valid: false,
    });
  });

  test('returns a successful validation result', () => {
    const fields: readonly FormFieldConfig<'email'>[] = [
      {
        name: 'email',
        label: 'Email',
        rules: [{ kind: 'required' }, { kind: 'email' }],
      },
    ];

    expect(validateFields(fields, { email: 'person@example.com' })).toEqual({
      errors: {},
      valid: true,
    });
  });
});
