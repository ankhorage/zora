import type { ZoraComponentMeta } from '../../metadata';

export const textMeta = {
  name: 'Text',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Text',
    defaultProps: {
      text: 'Text',
      emphasis: 'default',
      variant: 'body',
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
      default: 'Text',
    },
    i18nKey: {
      type: 'string',
      category: 'Content',
      label: 'i18n key',
    },
    variant: {
      type: 'enum',
      category: 'Typography',
      label: 'Variant',
      enum: ['body', 'lead', 'bodySmall', 'caption', 'label', 'eyebrow', 'code'],
      default: 'body',
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: [
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
    emphasis: {
      type: 'enum',
      category: 'Style',
      label: 'Emphasis',
      enum: ['default', 'muted', 'subtle', 'inverse'],
      default: 'default',
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
