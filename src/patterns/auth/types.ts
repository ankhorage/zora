import type React from 'react';

import type { FormFieldConfig, FormValues } from '../../components/form';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type AuthIdentifierKind = 'email' | 'phone' | 'username';

export interface AuthFormBaseProps extends ZoraBaseProps {
  loading?: boolean;
  disabled?: boolean;
  error?: React.ReactNode;
  submitLabel?: React.ReactNode;
}

export interface SignInFormValues {
  identifier: string;
  identifierKind: AuthIdentifierKind;
  secret: string;
}

export interface SignInFormProps extends AuthFormBaseProps {
  identifiers?: readonly AuthIdentifierKind[];
  identifierLabel?: React.ReactNode;
  secretLabel?: React.ReactNode;
  forgotPasswordLabel?: React.ReactNode;
  signUpLabel?: React.ReactNode;
  onSubmit: (values: SignInFormValues) => void | Promise<void>;
  onForgotPassword?: () => void | Promise<void>;
  onSignUp?: () => void | Promise<void>;
}

export type SignUpFormValues = FormValues;
export type SignUpFormField = FormFieldConfig;

export interface SignUpFormProps extends AuthFormBaseProps {
  fields?: readonly SignUpFormField[];
  signInLabel?: React.ReactNode;
  onSubmit: (values: SignUpFormValues) => void | Promise<void>;
  onSignIn?: () => void | Promise<void>;
}

export interface ForgotPasswordFormValues {
  identifier: string;
  identifierKind: AuthIdentifierKind;
}

export interface ForgotPasswordFormProps extends AuthFormBaseProps {
  identifiers?: readonly AuthIdentifierKind[];
  identifierLabel?: React.ReactNode;
  signInLabel?: React.ReactNode;
  onSubmit: (values: ForgotPasswordFormValues) => void | Promise<void>;
  onSignIn?: () => void | Promise<void>;
}

export interface OtpFormValues {
  otp: string;
}

export interface OtpFormProps extends AuthFormBaseProps {
  length?: number;
  otpLabel?: React.ReactNode;
  resendLabel?: React.ReactNode;
  resendDisabled?: boolean;
  resendLoading?: boolean;
  onSubmit: (values: OtpFormValues) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
}
