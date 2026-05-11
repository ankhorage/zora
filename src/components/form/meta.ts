import type { ZoraComponentMeta } from '../../metadata';

export const formMeta = {
  name: 'Form',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Form orchestration component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const formActionsMeta = {
  name: 'FormActions',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Form helper component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const formErrorMeta = {
  name: 'FormError',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Form helper component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const formFieldMeta = {
  name: 'FormField',
  category: 'component',
  directManifestNode: true,
  allowedChildren: ['Input', 'Textarea'],
  blueprint: {
    label: 'Form field',
    defaultProps: {
      label: 'Label',
    },
  },
  props: {
    label: {
      type: 'string',
      category: 'Content',
      label: 'Label',
      default: 'Label',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
    },
    helperText: {
      type: 'string',
      category: 'Content',
      label: 'Helper text',
    },
    required: {
      type: 'boolean',
      category: 'Validation',
      label: 'Required',
      default: false,
    },
    invalid: {
      type: 'boolean',
      category: 'Validation',
      label: 'Invalid',
      default: false,
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
