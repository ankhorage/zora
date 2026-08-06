import { ZORA_COLORS, ZORA_EMPHASES } from '../../internal/colorModel';
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
      authoring: { authority: 'instance' },
    },
    i18nKey: {
      type: 'string',
      category: 'Content',
      label: 'i18n key',
      authoring: { authority: 'instance' },
    },
    level: {
      type: 'enum',
      category: 'Semantics',
      label: 'Level',
      enum: [1, 2, 3, 4, 5, 6],
      default: 2,
      authoring: { authority: 'instance' },
    },
    size: {
      type: 'enum',
      category: 'Typography',
      label: 'Size',
      enum: ['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
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
