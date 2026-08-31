import type { ZoraComponentMeta } from '../../metadata';
import { CONTENT_RAIL_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

const spacingValues = ['none', 'xs', 's', 'm', 'l', 'xl'] as const;

export const contentRailMeta = {
  name: 'ContentRail',
  category: 'pattern',
  description:
    'Horizontally browsable child content with responsive sizing, partial-next affordance, and accessible controls.',
  directManifestNode: true,
  allowedChildren: [...CONTENT_RAIL_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Content rail',
    icon: { name: 'albums-outline' },
    defaultProps: {
      itemSize: 'responsive',
      gap: 'm',
      padding: 'm',
      peek: 32,
      showControls: true,
      direction: 'auto',
      motion: 'system',
      accessibilityLabel: 'Content rail',
      previousLabel: 'Previous items',
      nextLabel: 'Next items',
    },
  },
  events: {
    controlPress: {
      label: 'Control press',
      eventType: 'contentRail.controlPress',
      description: 'Emitted after a previous or next control requests a target item.',
      payloadFields: [
        { path: 'direction', type: 'string', label: 'Direction' },
        { path: 'targetIndex', type: 'number', label: 'Target index' },
      ],
    },
    visibleRangeChange: {
      label: 'Visible range change',
      eventType: 'contentRail.visibleRangeChange',
      description: 'Emitted when the zero-based visible item range changes.',
      payloadFields: [
        { path: 'firstVisibleIndex', type: 'number', label: 'First visible index' },
        { path: 'lastVisibleIndex', type: 'number', label: 'Last visible index' },
        { path: 'itemCount', type: 'number', label: 'Item count' },
      ],
    },
  },
  slots: {
    children: {
      label: 'Rail items',
      allowedChildren: [...CONTENT_RAIL_ALLOWED_CHILDREN],
    },
  },
  props: {
    itemSize: {
      type: 'enum',
      category: 'Layout',
      label: 'Item size',
      enum: ['compact', 'regular', 'wide', 'responsive'],
      default: 'responsive',
    },
    gap: {
      type: 'enum',
      category: 'Layout',
      label: 'Gap',
      enum: spacingValues,
      default: 'm',
    },
    padding: {
      type: 'enum',
      category: 'Layout',
      label: 'Horizontal padding',
      enum: spacingValues,
      default: 'm',
    },
    peek: {
      type: 'number',
      category: 'Layout',
      label: 'Partial next item',
      default: 32,
    },
    showControls: {
      type: 'boolean',
      category: 'Controls',
      label: 'Show controls',
      default: true,
    },
    direction: {
      type: 'enum',
      category: 'Layout',
      label: 'Reading direction',
      enum: ['auto', 'ltr', 'rtl'],
      default: 'auto',
    },
    motion: {
      type: 'enum',
      category: 'Accessibility',
      label: 'Motion',
      enum: ['system', 'animated', 'reduced'],
      default: 'system',
    },
    accessibilityLabel: {
      type: 'string',
      category: 'Accessibility',
      label: 'Rail label',
      default: 'Content rail',
    },
    previousLabel: {
      type: 'string',
      category: 'Accessibility',
      label: 'Previous control label',
      default: 'Previous items',
    },
    nextLabel: {
      type: 'string',
      category: 'Accessibility',
      label: 'Next control label',
      default: 'Next items',
    },
    onControlPress: {
      type: 'action',
      category: 'Events',
      label: 'Control press action',
    },
    onVisibleRangeChange: {
      type: 'action',
      category: 'Events',
      label: 'Visible range change action',
    },
  },
} as const satisfies ZoraComponentMeta;
