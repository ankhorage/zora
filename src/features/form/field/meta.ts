import type { ZoraComponentMeta } from '../../authoring';

export const fieldMeta = {
  name: 'Field',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [
    'Checkbox',
    'CheckboxGroup',
    'RadioGroup',
    'SearchInput',
    'Select',
    'Switch',
    'TextInput',
  ],
  blueprint: { label: 'Field', defaultProps: { label: 'Label' } },
  bindings: {
    props: {
      errorText: {
        label: 'Error text',
        description: 'Field-level validation error.',
        value: { type: 'unknown' },
        acceptsFallback: true,
      },
      disabled: {
        label: 'Disabled',
        description: 'Whether the field is disabled.',
        value: { type: 'boolean' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
  },
  props: {
    label: { type: 'string', category: 'Content', label: 'Label', default: 'Label' },
    description: { type: 'string', category: 'Content', label: 'Description' },
    helperText: { type: 'string', category: 'Content', label: 'Helper text' },
    errorText: { type: 'string', category: 'Validation', label: 'Error text' },
    required: { type: 'boolean', category: 'Validation', label: 'Required', default: false },
    invalid: { type: 'boolean', category: 'Validation', label: 'Invalid', default: false },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
    readOnly: { type: 'boolean', category: 'State', label: 'Read-only', default: false },
  },
} as const satisfies ZoraComponentMeta;
