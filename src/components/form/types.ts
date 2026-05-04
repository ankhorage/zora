import type { FieldProps as SurfaceFieldProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';
import type { InputProps } from '../input';

export type ValidationRule =
  | { kind: 'required'; message?: string }
  | { kind: 'email'; message?: string }
  | { kind: 'minLength'; value: number; message?: string }
  | { kind: 'pattern'; value: string; message?: string };

export type FormFieldValue = string;
export type FormValues<TName extends string = string> = Record<TName, FormFieldValue>;
export type FormErrors<TName extends string = string> = Partial<Record<TName, React.ReactNode>>;
export type FormValidationErrors<TName extends string = string> = Partial<Record<TName, string>>;

export type FormFieldInputType = 'email' | 'number' | 'otp' | 'password' | 'tel' | 'text' | 'url';

export interface FormFieldConfig<TName extends string = string> {
  name: TName;
  label: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  type?: FormFieldInputType;
  placeholder?: string;
  rules?: readonly ValidationRule[];
  autoCapitalize?: InputProps['autoCapitalize'];
  autoComplete?: InputProps['autoComplete'];
  keyboardType?: InputProps['keyboardType'];
  maxLength?: InputProps['maxLength'];
  readOnly?: boolean;
  required?: boolean;
  secureTextEntry?: boolean;
  textContentType?: InputProps['textContentType'];
  disabled?: boolean;
  testID?: string;
}

export interface FormFieldWrapperProps
  extends
    ZoraBaseProps,
    Pick<
      Omit<SurfaceFieldProps, 'mode' | 'themeId'>,
      'children' | 'disabled' | 'errorText' | 'invalid' | 'readOnly' | 'required'
    > {
  label: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
}

export interface FormFieldControlProps<TName extends string = string> extends ZoraBaseProps {
  field: FormFieldConfig<TName>;
  value: FormFieldValue;
  onChange: (name: TName, value: FormFieldValue) => void;
  error?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export type FormFieldProps<TName extends string = string> =
  | FormFieldControlProps<TName>
  | FormFieldWrapperProps;

export interface FormActionsProps extends ZoraBaseProps {
  submitLabel?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onSubmit?: () => void;
  children?: React.ReactNode;
}

export interface FormErrorProps extends ZoraBaseProps {
  error?: React.ReactNode;
}

export interface FormProps<TName extends string = string> extends ZoraBaseProps {
  fields: readonly FormFieldConfig<TName>[];
  values: FormValues<TName>;
  onChange: (values: FormValues<TName>) => void;
  onSubmit: (values: FormValues<TName>) => void | Promise<void>;
  errors?: FormErrors<TName>;
  error?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  submitLabel?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  validateOnChange?: boolean;
}

export interface FormValidationResult<TName extends string = string> {
  errors: FormValidationErrors<TName>;
  valid: boolean;
}

export interface UseFormControllerOptions<TName extends string = string> {
  fields: readonly FormFieldConfig<TName>[];
  initialValues?: Partial<FormValues<TName>>;
  values?: FormValues<TName>;
  errors?: FormErrors<TName>;
  onChange?: (values: FormValues<TName>) => void;
  onSubmit?: (values: FormValues<TName>) => void | Promise<void>;
  validateOnChange?: boolean;
}

export interface UseFormControllerResult<TName extends string = string> {
  values: FormValues<TName>;
  errors: FormErrors<TName>;
  setValues: (values: FormValues<TName>) => void;
  setFieldValue: (name: TName, value: FormFieldValue) => void;
  validate: () => FormValidationResult<TName>;
  handleSubmit: () => Promise<void>;
  reset: () => void;
}
