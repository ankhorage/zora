import type { ZoraComponentMeta } from '../authoring';

export const popoverMenuMeta = {
  name: 'PopoverMenu',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Code-facing anchored action menu; the trigger is a render prop and is not serialized as a direct manifest node.',
  props: {},
} as const satisfies ZoraComponentMeta;
