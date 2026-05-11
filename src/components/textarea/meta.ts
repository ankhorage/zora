import type { ZoraComponentMeta } from '../../metadata';

export const textareaMeta = {
  name: 'Textarea',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Textarea',
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
  },
} as const satisfies ZoraComponentMeta;
