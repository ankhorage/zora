import type { ZoraComponentMeta } from '../../metadata';

export const heroMeta = {
  name: 'Hero',
  category: 'pattern',
  description: 'Landing-page and section hero with title copy, actions, and optional media.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Hero',
    icon: { name: 'sparkles-outline' },
    defaultProps: {
      eyebrow: 'New release',
      title: 'Build product screens faster',
      description: 'Use a responsive hero pattern with strong defaults and structured actions.',
      align: 'start',
      layout: 'split',
      tone: 'subtle',
    },
  },
  i18n: {
    fields: [
      { keyProp: 'eyebrowI18nKey', defaultTextProp: 'eyebrow' },
      { keyProp: 'titleI18nKey', defaultTextProp: 'title' },
      { keyProp: 'descriptionI18nKey', defaultTextProp: 'description' },
    ],
  },
  slots: {
    media: {
      label: 'Media',
      allowedChildren: ['Image', 'Card', 'MetricCard', 'MediaCard'],
    },
    footer: {
      label: 'Footer',
      allowedChildren: ['Badge', 'Text', 'AvatarGroup'],
    },
  },
  props: {
    eyebrow: {
      type: 'string',
      category: 'Content',
      label: 'Eyebrow',
      default: 'New release',
    },
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      default: 'Build product screens faster',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
      default: 'Use a responsive hero pattern with strong defaults and structured actions.',
    },
    align: {
      type: 'enum',
      category: 'Layout',
      label: 'Alignment',
      enum: ['start', 'center'],
      default: 'start',
    },
    layout: {
      type: 'enum',
      category: 'Layout',
      label: 'Layout',
      enum: ['stack', 'split', 'mediaFirst'],
      default: 'split',
    },
    tone: {
      type: 'enum',
      category: 'Appearance',
      label: 'Tone',
      enum: ['default', 'subtle', 'outline'],
      default: 'subtle',
    },
    compact: {
      type: 'boolean',
      category: 'Layout',
      label: 'Compact',
      default: false,
    },
    primaryAction: {
      type: 'action',
      category: 'Actions',
      label: 'Primary action',
    },
    secondaryAction: {
      type: 'action',
      category: 'Actions',
      label: 'Secondary action',
    },
  },
} as const satisfies ZoraComponentMeta;
