import type { ZoraComponentMeta } from '../authoring';

export const signUpFormMeta = {
  name: 'SignUpForm',
  category: 'pattern',
  description: 'Collects configurable account fields for sign-up.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Sign-up form',
    defaultProps: {
      signInLabel: 'Sign in',
      submitLabel: 'Sign up',
      loading: false,
      disabled: false,
    },
  },
  events: {
    submit: {
      label: 'Submit',
      eventType: 'signUpForm.submit',
      payloadFields: [{ path: 'values', type: 'record', label: 'Values' }],
    },
    signIn: {
      label: 'Sign in',
      eventType: 'signUpForm.signIn',
      payloadFields: [],
    },
  },
  props: {
    fields: {
      type: 'array',
      category: 'Authentication',
      label: 'Fields',
      itemSchema: [
        { key: 'name', schema: { type: 'string', category: 'Identity', label: 'Name' } },
        { key: 'label', schema: { type: 'string', category: 'Content', label: 'Label' } },
        {
          key: 'type',
          schema: {
            type: 'enum',
            category: 'Authentication',
            label: 'Type',
            enum: ['email', 'number', 'otp', 'password', 'tel', 'text', 'url'],
          },
        },
        {
          key: 'placeholder',
          schema: { type: 'string', category: 'Content', label: 'Placeholder' },
        },
        {
          key: 'required',
          schema: { type: 'boolean', category: 'Validation', label: 'Required' },
        },
        {
          key: 'disabled',
          schema: { type: 'boolean', category: 'State', label: 'Disabled' },
        },
      ],
    },
    signInLabel: { type: 'string', category: 'Content', label: 'Sign-in label' },
    submitLabel: { type: 'string', category: 'Content', label: 'Submit label' },
    error: { type: 'string', category: 'State', label: 'Error' },
    loading: { type: 'boolean', category: 'State', label: 'Loading', default: false },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
  },
} as const satisfies ZoraComponentMeta;
