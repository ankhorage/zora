import { ZORA_COLORS, ZORA_EMPHASES } from '../../internal/colorModel';
import type { ZoraComponentMeta } from '../../metadata';

const themeAuthoring = {
  authority: 'theme',
  scope: 'component',
  allowInstanceOverride: true,
} as const;

export const textMeta = {
  name: 'Text',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Text', defaultProps: { text: 'Text' } },
  i18n: { fields: [{ keyProp: 'i18nKey', defaultTextProp: 'text' }] },
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
      authoring: themeAuthoring,
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: ZORA_COLORS,
      authoring: themeAuthoring,
    },
    emphasis: {
      type: 'enum',
      category: 'Style',
      label: 'Emphasis',
      enum: ZORA_EMPHASES,
      authoring: themeAuthoring,
    },
    align: {
      type: 'enum',
      category: 'Layout',
      label: 'Align',
      enum: ['auto', 'left', 'right', 'center', 'justify'],
      authoring: themeAuthoring,
    },
    weight: {
      type: 'enum',
      category: 'Typography',
      label: 'Weight',
      enum: ['regular', 'medium', 'semiBold', 'bold'],
      authoring: themeAuthoring,
    },
    italic: { type: 'boolean', category: 'Typography', label: 'Italic', authoring: themeAuthoring },
    numberOfLines: {
      type: 'number',
      category: 'Layout',
      label: 'Line clamp',
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
