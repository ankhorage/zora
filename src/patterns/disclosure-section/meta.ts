import type { ZoraComponentMeta } from '../../metadata';

export const disclosureSectionMeta = {
  name: 'DisclosureSection',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Disclosure pattern; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
