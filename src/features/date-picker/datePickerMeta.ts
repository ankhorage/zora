import type { ZoraComponentMeta } from '../authoring';

export const datePickerMeta = {
  name: 'DatePicker',
  category: 'component',
  description: 'Captures a local calendar date through the shared BottomSheet picker host.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Date picker',
    defaultProps: {
      value: null,
      placeholder: 'Choose date',
      disabled: false,
      required: false,
    },
  },
  events: {
    valueChange: {
      label: 'Value change',
      eventType: 'datePicker.valueChange',
      description: 'Emitted when a local calendar date is selected.',
      payloadFields: [{ path: 'value', type: 'string', label: 'Value' }],
    },
  },
  props: {
    value: {
      type: 'string',
      category: 'State',
      label: 'Value',
      default: null,
      authoring: { authority: 'instance' },
    },
    label: { type: 'string', category: 'Content', label: 'Label' },
    description: { type: 'string', category: 'Content', label: 'Description' },
    error: { type: 'string', category: 'Validation', label: 'Error' },
    placeholder: {
      type: 'string',
      category: 'Content',
      label: 'Placeholder',
      default: 'Choose date',
    },
    minDate: { type: 'string', category: 'Validation', label: 'Minimum date' },
    maxDate: { type: 'string', category: 'Validation', label: 'Maximum date' },
    disabled: {
      type: 'boolean',
      category: 'State',
      label: 'Disabled',
      default: false,
    },
    required: {
      type: 'boolean',
      category: 'Validation',
      label: 'Required',
      default: false,
    },
  },
} as const satisfies ZoraComponentMeta;
