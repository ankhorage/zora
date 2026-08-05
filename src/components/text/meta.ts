import { ZORA_COLORS, ZORA_EMPHASES } from '../../internal/colorModel';
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
      authoring: { authority: 'instance' },
    },
    i18nKey: {
      type: 'string',
      category: 'Content',
      label: 'i18n key',
      authoring: { authority: 'instance' },
    },
    variant: {
      type: 'enum',
      category: 'Typography',
      label: 'Variant',
      enum: ['body', 'lead', 'bodySmall', 'caption', 'label', 'eyebrow', 'code'],
      default: 'body',
      authoring: { authority: 'theme', scope: 'component' },
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: ZORA_COLORS,
      authoring: { authority: 'theme', scope: 'component' },
    },
    emphasis: {
      type: 'enum',
      category: 'Style',
      label: 'Emphasis',
      enum: ZORA_EMPHASES,
      default: 'default',
      authoring: { authority: 'theme', scope: 'component' },
    },
    align: {
      type: 'enum',
      category: 'Layout',
      label: 'Align',
      enum: ['auto', 'left', 'right', 'center', 'justify'],
      authoring: { authority: 'theme', scope: 'component' },
    },
    weight: {
      type: 'enum',
      category: 'Typography',
      label: 'Weight',
      enum: ['regular', 'medium', 'semiBold', 'bold'],
      authoring: { authority: 'theme', scope: 'component' },
    },
    italic: {
      type: 'boolean',
      category: 'Typography',
      label: 'Italic',
      default: false,
      authoring: { authority: 'theme', scope: 'component' },
    },
    numberOfLines: {
      type: 'number',
      category: 'Layout',
      label: 'Line clamp',
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
