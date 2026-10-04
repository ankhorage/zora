import { INVERTED_POLARITY_PROP } from '../../constants/authoring';
import type { ZoraComponentMeta } from '../../types/authoring';

export const appBarMeta = {
  name: 'AppBar',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Application chrome component; not represented as a manifest node in v1.',
  props: { inverted: INVERTED_POLARITY_PROP },
} as const satisfies ZoraComponentMeta;
