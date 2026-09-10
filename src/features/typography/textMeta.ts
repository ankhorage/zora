import { COMPONENT_THEME_AUTHORING } from '../../constants';
import { ZORA_COLORS, ZORA_EMPHASES } from '../../internal/colorModel';
import type { ZoraComponentMeta } from '../../metadata';

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
      authoring: COMPONENT_THEME_AUTHORING,
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: ZORA_COLORS,
      authoring: COMPONENT_THEME_AUTHORING,
    },
    emphasis: {
      type: 'enum',
      category: 'Style',
      label: 'Emphasis',
      enum: ZORA_EMPHASES,
      authoring: COMPONENT_THEME_AUTHORING,
    },
    align: {
      type: 'enum',
      category: 'Layout',
      label: 'Align',
      enum: ['auto', 'left', 'right', 'center', 'justify'],
      authoring: COMPONENT_THEME_AUTHORING,
    },
    weight: {
      type: 'enum',
      category: 'Typography',
      label: 'Weight',
      enum: ['regular', 'medium', 'semiBold', 'bold'],
      authoring: COMPONENT_THEME_AUTHORING,
    },
    italic: {
      type: 'boolean',
      category: 'Typography',
      label: 'Italic',
      authoring: COMPONENT_THEME_AUTHORING,
    },
    numberOfLines: {
      type: 'number',
      category: 'Layout',
      label: 'Line clamp',
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
