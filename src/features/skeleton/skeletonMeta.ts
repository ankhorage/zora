import type { ZoraComponentMeta } from '../authoring';

export const skeletonMeta = {
  name: 'Skeleton',
  category: 'component',
  description: 'Generic visual placeholder for a loading content region.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Skeleton',
    defaultProps: { height: 16, radius: 'm' },
  },
  props: {
    width: { type: 'number', category: 'Layout', label: 'Width' },
    height: { type: 'number', category: 'Layout', label: 'Height', default: 16 },
    radius: { type: 'radius', category: 'Appearance', label: 'Radius', default: 'm' },
  },
} as const satisfies ZoraComponentMeta;

export const skeletonTextMeta = {
  name: 'SkeletonText',
  category: 'component',
  description: 'Multi-line placeholder for loading text content.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Skeleton text',
    defaultProps: { lines: 3, lineHeight: 12, gap: 'xs' },
  },
  props: {
    lines: { type: 'number', category: 'Content', label: 'Lines', default: 3 },
    lineHeight: { type: 'number', category: 'Layout', label: 'Line height', default: 12 },
    gap: { type: 'spacing', category: 'Spacing', label: 'Gap', default: 'xs' },
    width: { type: 'number', category: 'Layout', label: 'Width' },
    lastLineWidth: { type: 'number', category: 'Layout', label: 'Last line width' },
  },
} as const satisfies ZoraComponentMeta;

export const skeletonCardMeta = {
  name: 'SkeletonCard',
  category: 'component',
  description: 'Card-shaped placeholder for loading media, copy, and actions.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Skeleton card',
    defaultProps: { media: false, actions: false, lines: 3, compact: false },
  },
  props: {
    media: { type: 'boolean', category: 'Content', label: 'Media', default: false },
    actions: { type: 'boolean', category: 'Content', label: 'Actions', default: false },
    lines: { type: 'number', category: 'Content', label: 'Lines', default: 3 },
    compact: { type: 'boolean', category: 'Layout', label: 'Compact', default: false },
  },
} as const satisfies ZoraComponentMeta;

export const skeletonListMeta = {
  name: 'SkeletonList',
  category: 'component',
  description: 'List-shaped placeholder for loading rows with optional leading content.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Skeleton list',
    defaultProps: {
      rows: 5,
      avatar: false,
      media: false,
      lines: 2,
      variant: 'divider',
      compact: false,
    },
  },
  props: {
    rows: { type: 'number', category: 'Content', label: 'Rows', default: 5 },
    avatar: { type: 'boolean', category: 'Content', label: 'Avatar', default: false },
    media: { type: 'boolean', category: 'Content', label: 'Media', default: false },
    lines: { type: 'number', category: 'Content', label: 'Lines', default: 2 },
    variant: {
      type: 'enum',
      category: 'Appearance',
      label: 'Variant',
      enum: ['divider', 'card'],
      default: 'divider',
    },
    compact: { type: 'boolean', category: 'Layout', label: 'Compact', default: false },
  },
} as const satisfies ZoraComponentMeta;
