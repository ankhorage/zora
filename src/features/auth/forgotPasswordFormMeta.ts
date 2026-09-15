import type { ZoraComponentMeta } from '../authoring';

export const forgotPasswordFormMeta = {
  name: 'ForgotPasswordForm',
  category: 'pattern',
  description: 'Collects an account identifier to start password recovery.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Forgot password form',
    defaultProps: {
      identifiers: ['email'],
      identifierLabel: 'Email',
      signInLabel: 'Sign in',
      submitLabel: 'Send code',
      loading: false,
      disabled: false,
    },
  },
  events: {
    submit: {
      label: 'Submit',
      eventType: 'forgotPasswordForm.submit',
      payloadFields: [
        { path: 'identifier', type: 'string', label: 'Identifier' },
        { path: 'identifierKind', type: 'string', label: 'Identifier kind' },
      ],
    },
    signIn: {
      label: 'Sign in',
      eventType: 'forgotPasswordForm.signIn',
      payloadFields: [],
    },
  },
  props: {
    identifiers: {
      type: 'array',
      category: 'Authentication',
      label: 'Identifiers',
      default: ['email'],
    },
    identifierLabel: { type: 'string', category: 'Content', label: 'Identifier label' },
    signInLabel: { type: 'string', category: 'Content', label: 'Sign-in label' },
    submitLabel: { type: 'string', category: 'Content', label: 'Submit label' },
    error: { type: 'string', category: 'State', label: 'Error' },
    loading: { type: 'boolean', category: 'State', label: 'Loading', default: false },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
  },
} as const satisfies ZoraComponentMeta;
