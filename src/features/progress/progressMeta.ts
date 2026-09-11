import { ZORA_COLORS } from '../../internal/colorModel';
import type { ZoraComponentMeta } from '../../metadata';

export const progressMeta = {
  name: 'Progress',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Progress',
    defaultProps: {
      value: 50,
      max: 100,
      color: 'primary',
      size: 'm',
    },
  },
  props: {
    value: {
      type: 'number',
      category: 'State',
      label: 'Value',
      default: 50,
    },
    max: {
      type: 'number',
      category: 'State',
      label: 'Max',
      default: 100,
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: [...ZORA_COLORS],
      default: 'primary',
    },
    size: {
      type: 'enum',
      category: 'Style',
      label: 'Size',
      enum: ['s', 'm', 'l'],
      default: 'm',
    },
  },
} as const satisfies ZoraComponentMeta;

const instanceAuthoring = { authority: 'instance' } as const;

export const progressRingMeta = {
  name: 'ProgressRing',
  category: 'component',
  description: 'Displays circular determinate progress with optional center value and label text.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Progress ring',
    defaultProps: {
      value: 68,
      max: 100,
      color: 'primary',
      trackColor: 'neutral',
      size: 120,
      thickness: 10,
      centerValue: '68%',
      centerLabel: 'Complete',
      accessibilityLabel: 'Progress',
      accessibilityValueText: '68% complete',
    },
  },
  props: {
    value: {
      type: 'number',
      category: 'State',
      label: 'Value',
      default: 68,
      authoring: instanceAuthoring,
    },
    max: {
      type: 'number',
      category: 'State',
      label: 'Maximum',
      default: 100,
      authoring: instanceAuthoring,
    },
    centerValue: {
      type: 'string',
      category: 'Content',
      label: 'Center value',
      default: '68%',
      authoring: instanceAuthoring,
    },
    centerLabel: {
      type: 'string',
      category: 'Content',
      label: 'Center label',
      default: 'Complete',
      authoring: instanceAuthoring,
    },
    accessibilityLabel: {
      type: 'string',
      category: 'Accessibility',
      label: 'Accessibility label',
      default: 'Progress',
      authoring: instanceAuthoring,
    },
    accessibilityValueText: {
      type: 'string',
      category: 'Accessibility',
      label: 'Accessibility value text',
      default: '68% complete',
      authoring: instanceAuthoring,
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Progress color',
      enum: [...ZORA_COLORS],
      default: 'primary',
      authoring: instanceAuthoring,
    },
    trackColor: {
      type: 'enum',
      category: 'Style',
      label: 'Track color',
      enum: [...ZORA_COLORS],
      default: 'neutral',
      authoring: instanceAuthoring,
    },
    size: {
      type: 'number',
      category: 'Layout',
      label: 'Diameter',
      default: 120,
      authoring: instanceAuthoring,
    },
    thickness: {
      type: 'number',
      category: 'Style',
      label: 'Thickness',
      default: 10,
      authoring: instanceAuthoring,
    },
  },
} as const satisfies ZoraComponentMeta;
