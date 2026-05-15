import type { ZoraComponentMeta } from '../../metadata';

export const headingMeta = {
  name: 'Heading',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Heading',
    defaultProps: {
      text: 'Heading',
      level: 2,
    },
  },
  i18n: {
    fields: [{ keyProp: 'i18nKey', defaultTextProp: 'text' }],
  },
  props: {
    text: {
      type: 'string',
      category: 'Content',
      label: 'Text',
      default: 'Heading',
    },
    i18nKey: {
      type: 'string',
      category: 'Content',
      label: 'i18n key',
    },
    level: {
      type: 'enum',
      category: 'Semantics',
      label: 'Level',
      enum: [1, 2, 3, 4, 5, 6],
      default: 2,
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: [
        'default',
        'muted',
        'subtle',
        'inverse',
        'primary',
        'secondary',
        'tertiary',
        'quaternary',
        'neutral',
        'success',
        'warning',
        'error',
        'info',
        'danger',
      ],
    },
    align: {
      type: 'enum',
      category: 'Layout',
      label: 'Align',
      enum: ['auto', 'left', 'right', 'center', 'justify'],
    },
    weight: {
      type: 'enum',
      category: 'Typography',
      label: 'Weight',
      enum: ['regular', 'medium', 'semiBold', 'bold'],
    },
    italic: {
      type: 'boolean',
      category: 'Typography',
      label: 'Italic',
      default: false,
    },
    numberOfLines: {
      type: 'number',
      category: 'Layout',
      label: 'Line clamp',
    },
  },
} as const satisfies ZoraComponentMeta;
