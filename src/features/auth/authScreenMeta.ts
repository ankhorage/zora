import type { ZoraComponentMeta } from '../../types/authoring';

export const authScreenMeta = {
  name: 'AuthScreen',
  category: 'pattern',
  description:
    'Presents a complete responsive sign-in or sign-up screen while leaving authentication orchestration to the consumer.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Auth screen',
    defaultProps: {
      authMode: 'signIn',
      identifiers: ['email'],
      loading: false,
      disabled: false,
    },
  },
  events: {
    modeChange: {
      label: 'Mode change',
      eventType: 'authScreen.modeChange',
      payloadFields: [{ path: 'mode', type: 'string', label: 'Mode' }],
    },
    oauthProviderPress: {
      label: 'OAuth provider press',
      eventType: 'authScreen.oauthProviderPress',
      payloadFields: [{ path: 'providerId', type: 'string', label: 'Provider ID' }],
    },
    signInSubmit: {
      label: 'Sign-in submit',
      eventType: 'authScreen.signInSubmit',
      payloadFields: [
        { path: 'identifier', type: 'string', label: 'Identifier' },
        { path: 'identifierKind', type: 'string', label: 'Identifier kind' },
        { path: 'secret', type: 'string', label: 'Secret' },
      ],
    },
    signUpSubmit: {
      label: 'Sign-up submit',
      eventType: 'authScreen.signUpSubmit',
      payloadFields: [{ path: 'values', type: 'record', label: 'Values' }],
    },
  },
  props: {
    authMode: {
      type: 'enum',
      category: 'Authentication',
      label: 'Auth mode',
      enum: ['signIn', 'signUp'],
      default: 'signIn',
    },
    title: { type: 'string', category: 'Content', label: 'Title' },
    description: { type: 'string', category: 'Content', label: 'Description' },
    info: { type: 'string', category: 'State', label: 'Info' },
    error: { type: 'string', category: 'State', label: 'Error' },
    loading: { type: 'boolean', category: 'State', label: 'Loading', default: false },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
    identifiers: {
      type: 'array',
      category: 'Authentication',
      label: 'Identifiers',
      default: ['email'],
    },
    identifierLabel: { type: 'string', category: 'Content', label: 'Identifier label' },
    signUpFields: {
      type: 'array',
      category: 'Authentication',
      label: 'Sign-up fields',
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
    oauthProviders: {
      type: 'array',
      category: 'Authentication',
      label: 'OAuth providers',
      itemSchema: [
        { key: 'id', schema: { type: 'string', category: 'Identity', label: 'Provider ID' } },
        { key: 'label', schema: { type: 'string', category: 'Content', label: 'Label' } },
        { key: 'disabled', schema: { type: 'boolean', category: 'State', label: 'Disabled' } },
        { key: 'loading', schema: { type: 'boolean', category: 'State', label: 'Loading' } },
      ],
    },
    oauthSeparatorLabel: {
      type: 'string',
      category: 'Content',
      label: 'OAuth separator label',
      default: 'or continue with password',
    },
  },
} as const satisfies ZoraComponentMeta;
