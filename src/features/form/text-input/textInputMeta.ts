import type { ZoraComponentMeta } from '../../../metadata';

export const textInputMeta = {
  name: 'TextInput',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Text input',
    defaultProps: {
      placeholder: 'Enter text…',
      value: '',
    },
  },
  props: {
    placeholder: {
      type: 'string',
      category: 'Content',
      label: 'Placeholder',
    },
    value: {
      type: 'string',
      category: 'Content',
      label: 'Value',
      default: '',
    },
    size: {
      type: 'enum',
      category: 'Style',
      label: 'Size',
      enum: ['s', 'm', 'l'],
    },
    disabled: {
      type: 'boolean',
      category: 'State',
      label: 'Disabled',
      default: false,
    },
    readOnly: {
      type: 'boolean',
      category: 'State',
      label: 'Read-only',
      default: false,
    },
    multiline: {
      type: 'boolean',
      category: 'Layout',
      label: 'Multiline',
      default: false,
    },
    secureTextEntry: {
      type: 'boolean',
      category: 'State',
      label: 'Secure text entry',
      default: false,
    },
  },
} as const satisfies ZoraComponentMeta;
