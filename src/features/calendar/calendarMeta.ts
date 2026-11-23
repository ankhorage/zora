import type { ZoraComponentMeta } from '../../types/authoring';

export const calendarMeta = {
  name: 'Calendar',
  category: 'component',
  description: 'Reusable local-date calendar with a month view backed by GridView geometry.',
  directManifestNode: false,
  note: 'Uses Date values and executable change callbacks; available through the public code API.',
  allowedChildren: [],
  props: {},
} as const satisfies ZoraComponentMeta;
