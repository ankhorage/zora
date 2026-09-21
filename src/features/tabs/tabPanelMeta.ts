import type { ZoraComponentMeta } from '../../types/authoring';
import { CONTAINER_ALLOWED_CHILDREN } from '../authoring/allowedChildren';
import { LAYOUT_PROPS } from '../layout/constants';

export const tabPanelMeta = {
  name: 'TabPanel',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  description: 'Content panel associated with one Tab value.',
  props: {
    ...LAYOUT_PROPS,
    value: { type: 'string', category: 'State', label: 'Value' },
  },
} as const satisfies ZoraComponentMeta;
