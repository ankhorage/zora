import type { ZoraComponentMeta } from '../../metadata';

export const skeletonMeta = {
  name: 'Skeleton',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Loading placeholder primitive; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const skeletonTextMeta = {
  name: 'SkeletonText',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Loading placeholder text composition; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const skeletonCardMeta = {
  name: 'SkeletonCard',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Loading placeholder card composition; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const skeletonListMeta = {
  name: 'SkeletonList',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Loading placeholder list composition; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
