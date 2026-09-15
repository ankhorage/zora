import type { ZoraComponentMeta } from '../../authoring';

export const selectMeta = {
  name: 'Select',
  category: 'component',
  description:
    'Single-value form selection with Popover presentation on web and BottomSheet presentation on native.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Select',
    defaultProps: {
      label: 'Option',
      placeholder: 'Select',
      defaultValue: 'option-b',
      options: [
        { value: 'option-a', label: 'First option' },
        { value: 'option-b', label: 'Second option' },
        { value: 'option-c', label: 'Third option' },
      ],
      disabled: false,
      readOnly: false,
      invalid: false,
    },
  },
  bindings: {
    props: {
      value: {
        label: 'Value',
        description: 'Currently selected option value.',
        value: { type: 'string' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
      disabled: {
        label: 'Disabled',
        description: 'Whether the select is disabled.',
        value: { type: 'boolean' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
    events: {
      valueChange: {
        label: 'Value change',
        description: 'Runs when the selected option value changes.',
        payload: {
          eventType: 'select.valueChange',
          fields: [{ path: 'value', type: 'string', label: 'Value' }],
        },
      },
    },
  },
  events: {
    valueChange: {
      label: 'Value change',
      eventType: 'select.valueChange',
      description: 'Emitted when the selected option value changes.',
      payloadFields: [{ path: 'value', type: 'string', label: 'Value' }],
    },
  },
  props: {
    defaultValue: {
      type: 'string',
      category: 'State',
      label: 'Initial value',
      authoring: { authority: 'instance' },
    },
    value: {
      type: 'string',
      category: 'State',
      label: 'Value',
      authoring: { authority: 'instance' },
    },
    options: {
      type: 'array',
      category: 'Content',
      label: 'Options',
      itemSchema: [
        {
          key: 'value',
          schema: { type: 'string', category: 'Content', label: 'Value' },
        },
        {
          key: 'label',
          schema: { type: 'string', category: 'Content', label: 'Label' },
        },
        {
          key: 'disabled',
          schema: {
            type: 'boolean',
            category: 'State',
            label: 'Disabled',
            default: false,
          },
        },
      ],
      authoring: { authority: 'instance' },
    },
    label: {
      type: 'string',
      category: 'Content',
      label: 'Label',
      authoring: { authority: 'instance' },
    },
    helperText: {
      type: 'string',
      category: 'Content',
      label: 'Helper text',
      authoring: { authority: 'instance' },
    },
    errorText: {
      type: 'string',
      category: 'Content',
      label: 'Error text',
      authoring: { authority: 'instance' },
    },
    placeholder: {
      type: 'string',
      category: 'Content',
      label: 'Placeholder',
      default: 'Select',
      authoring: { authority: 'instance' },
    },
    required: {
      type: 'boolean',
      category: 'State',
      label: 'Required',
      default: false,
      authoring: { authority: 'instance' },
    },
    disabled: {
      type: 'boolean',
      category: 'State',
      label: 'Disabled',
      default: false,
      authoring: { authority: 'instance' },
    },
    readOnly: {
      type: 'boolean',
      category: 'State',
      label: 'Read only',
      default: false,
      authoring: { authority: 'instance' },
    },
    invalid: {
      type: 'boolean',
      category: 'State',
      label: 'Invalid',
      default: false,
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
