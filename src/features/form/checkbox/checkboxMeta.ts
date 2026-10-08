import type { ZoraComponentMeta } from '../../../types/authoring';

export const checkboxMeta = {
  name: 'Checkbox',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Checkbox', defaultProps: { label: 'Option', checked: false } },
  events: {
    checkedChange: {
      label: 'Checked change',
      eventType: 'checkbox.checkedChange',
      description: 'Emitted when the checked state changes.',
      payloadFields: [{ path: 'checked', type: 'boolean', label: 'Checked' }],
    },
  },
  props: {
    label: { type: 'string', category: 'Content', label: 'Label' },
    checked: { type: 'boolean', category: 'State', label: 'Checked', default: false },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
  },
} as const satisfies ZoraComponentMeta;

export const checkboxGroupMeta = {
  name: 'CheckboxGroup',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Checkbox group',
    defaultProps: { value: [], options: [{ value: 'option-a', label: 'First option' }] },
  },
  props: {
    value: { type: 'array', category: 'State', label: 'Value' },
    options: { type: 'array', category: 'Content', label: 'Options' },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
  },
} as const satisfies ZoraComponentMeta;
