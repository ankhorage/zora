import { INVERTED_POLARITY_PROP } from '../../constants/authoring';
import type { ZoraComponentMeta } from '../../types/authoring';

export const appHeaderMeta = {
  name: 'AppHeader',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Application header built from AppBar. Inverted is inherited surface polarity; false resets the subtree to normal polarity.',
  props: {
    inverted: INVERTED_POLARITY_PROP,
  },
} as const satisfies ZoraComponentMeta;
