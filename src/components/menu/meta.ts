import type { ZoraComponentMeta } from '../../metadata';

export const menuMeta = {
  name: 'Menu',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Surface-backed action menu; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const dropdownMenuMeta = {
  name: 'DropdownMenu',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Product-facing alias for Menu trigger/action composition; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
