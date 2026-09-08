import { ZORA_COLORS } from '../../internal/colorModel';
import type { ZoraComponentMeta } from '../../metadata';

const themeAuthoring = {
  authority: 'theme',
  scope: 'component',
  allowInstanceOverride: true,
} as const;

export const radioMeta = {
  name: 'Radio',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Composition-level radio control; author repeated single-choice UI through RadioGroup.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const radioGroupMeta = {
  name: 'RadioGroup',
  category: 'component',
  description:
    'Single-choice group with inline or card presentation while preserving radio semantics.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Radio group',
    defaultProps: {
      value: 'option-b',
      options: [
        { value: 'option-a', label: 'First option', description: 'Supporting detail' },
        { value: 'option-b', label: 'Second option', description: 'Supporting detail' },
        { value: 'option-c', label: 'Third option', description: 'Supporting detail' },
      ],
      orientation: 'vertical',
      gap: 's',
      presentation: 'inline',
      color: 'primary',
      size: 'm',
      invalid: false,
      readOnly: false,
      disabled: false,
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
        description: 'Whether the complete radio group is disabled.',
        value: { type: 'boolean' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
    events: {
      valueChange: {
        label: 'Value change',
        description: 'Runs when the selected radio value changes.',
        payload: {
          eventType: 'radioGroup.valueChange',
          fields: [{ path: 'value', type: 'string', label: 'Value' }],
        },
      },
    },
  },
  events: {
    valueChange: {
      label: 'Value change',
      eventType: 'radioGroup.valueChange',
      description: 'Emitted when the selected radio value changes.',
      payloadFields: [{ path: 'value', type: 'string', label: 'Value' }],
    },
  },
  props: {
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
          schema: {
            type: 'string',
            category: 'Content',
            label: 'Value',
          },
        },
        {
          key: 'label',
          schema: {
            type: 'string',
            category: 'Content',
            label: 'Label',
          },
        },
        {
          key: 'description',
          schema: {
            type: 'string',
            category: 'Content',
            label: 'Description',
          },
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
    orientation: {
      type: 'enum',
      category: 'Layout',
      label: 'Orientation',
      enum: ['horizontal', 'vertical'],
      default: 'vertical',
      authoring: themeAuthoring,
    },
    gap: {
      type: 'enum',
      category: 'Layout',
      label: 'Gap',
      enum: ['xs', 's', 'm', 'l'],
      default: 's',
      authoring: themeAuthoring,
    },
    presentation: {
      type: 'enum',
      category: 'Style',
      label: 'Presentation',
      enum: ['inline', 'card'],
      default: 'inline',
      authoring: themeAuthoring,
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: [...ZORA_COLORS],
      default: 'primary',
      authoring: themeAuthoring,
    },
    size: {
      type: 'enum',
      category: 'Style',
      label: 'Size',
      enum: ['s', 'm', 'l'],
      default: 'm',
      authoring: themeAuthoring,
    },
    invalid: {
      type: 'boolean',
      category: 'State',
      label: 'Invalid',
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
    disabled: {
      type: 'boolean',
      category: 'State',
      label: 'Disabled',
      default: false,
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
