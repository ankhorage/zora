import type { ZoraComponentMeta } from '../../types/authoring';
import { CONTAINER_ALLOWED_CHILDREN } from '../authoring/allowedChildren';

export const tabPanelMeta = {
  name: 'TabPanel',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  description: 'Content panel associated with one Tab value.',
  props: {
    value: { type: 'string', category: 'State', label: 'Value' },
  },
} as const satisfies ZoraComponentMeta;
