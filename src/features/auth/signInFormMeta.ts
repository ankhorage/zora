import type { ZoraComponentMeta } from '../authoring';

export const signInFormMeta = {
  name: 'SignInForm',
  category: 'pattern',
  description: 'Collects an account identifier and secret for sign-in.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Sign-in form',
    defaultProps: {
      identifiers: ['email'],
      identifierLabel: 'Email',
      secretLabel: 'Password',
      forgotPasswordLabel: 'Forgot password',
      signUpLabel: 'Sign up',
      submitLabel: 'Sign in',
      loading: false,
      disabled: false,
    },
  },
  events: {
    submit: {
      label: 'Submit',
      eventType: 'signInForm.submit',
      payloadFields: [
        { path: 'identifier', type: 'string', label: 'Identifier' },
        { path: 'identifierKind', type: 'string', label: 'Identifier kind' },
        { path: 'secret', type: 'string', label: 'Secret' },
      ],
    },
    forgotPassword: {
      label: 'Forgot password',
      eventType: 'signInForm.forgotPassword',
      payloadFields: [],
    },
    signUp: {
      label: 'Sign up',
      eventType: 'signInForm.signUp',
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
    secretLabel: { type: 'string', category: 'Content', label: 'Secret label' },
    forgotPasswordLabel: {
      type: 'string',
      category: 'Content',
      label: 'Forgot-password label',
    },
    signUpLabel: { type: 'string', category: 'Content', label: 'Sign-up label' },
    submitLabel: { type: 'string', category: 'Content', label: 'Submit label' },
    error: { type: 'string', category: 'State', label: 'Error' },
    loading: { type: 'boolean', category: 'State', label: 'Loading', default: false },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
  },
} as const satisfies ZoraComponentMeta;
