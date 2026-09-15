import type { ZoraComponentMeta } from '../../types/authoring';

export const tabListMeta = {
  name: 'TabList',
  category: 'component',
  directManifestNode: true,
  allowedChildren: ['Tab'],
  description: 'Accessible list of selectable tabs.',
  props: {},
} as const satisfies ZoraComponentMeta;
