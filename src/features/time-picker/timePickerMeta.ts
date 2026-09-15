import type { ZoraComponentMeta } from '../authoring';

export const timePickerMeta = {
  name: 'TimePicker',
  category: 'component',
  description: 'Captures a local HH:mm time through the shared BottomSheet picker host.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Time picker',
    defaultProps: {
      value: null,
      placeholder: 'Choose time',
      stepMinutes: 30,
      disabled: false,
      required: false,
    },
  },
  events: {
    valueChange: {
      label: 'Value change',
      eventType: 'timePicker.valueChange',
      description: 'Emitted when an HH:mm time value is selected.',
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
      default: 'Choose time',
    },
    minTime: { type: 'string', category: 'Validation', label: 'Minimum time' },
    maxTime: { type: 'string', category: 'Validation', label: 'Maximum time' },
    stepMinutes: {
      type: 'number',
      category: 'Behavior',
      label: 'Step in minutes',
      default: 30,
    },
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
