import type { ZoraComponentMeta } from '../../metadata';
export const formFieldMeta = {
  name: 'FormField',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [
    'Checkbox',
    'CheckboxGroup',
    'RadioGroup',
    'SearchInput',
    'Select',
    'TextInput',
  ],
  blueprint: { label: 'Form field', defaultProps: { label: 'Label' } },
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
