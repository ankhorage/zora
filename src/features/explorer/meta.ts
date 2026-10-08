import type { ZoraComponentMeta } from '../../types/authoring';

const explorerProps = {
  items: {
    type: 'array',
    category: 'Data',
    itemSchema: [
      { key: 'id', schema: { type: 'string', category: 'Identity' } },
      { key: 'kind', schema: { type: 'enum', category: 'Data', enum: ['image', 'video', 'audio', 'document', 'file', 'folder'] } },
      { key: 'name', schema: { type: 'string', category: 'Content' } },
      { key: 'uri', schema: { type: 'string', category: 'Data' } },
      { key: 'thumbnailUri', schema: { type: 'string', category: 'Media' } },
      { key: 'contentType', schema: { type: 'string', category: 'Data' } },
      { key: 'sizeBytes', schema: { type: 'number', category: 'Data' } },
      { key: 'providerId', schema: { type: 'string', category: 'Identity' } },
      { key: 'disabled', schema: { type: 'boolean', category: 'State' } },
    ],
  },
  selectionMode: { type: 'enum', category: 'Selection', enum: ['single', 'multi'], default: 'single' },
  selectedIds: { type: 'array', category: 'Selection' },
  tileSize: { type: 'number', category: 'Layout', default: 120 },
  height: { type: 'number', category: 'Layout', default: 440 },
  zoom: { type: 'number', category: 'Layout', default: 1 },
  loading: { type: 'boolean', category: 'State' },
  errorText: { type: 'string', category: 'State' },
  emptyText: { type: 'string', category: 'Content' },
  disabled: { type: 'boolean', category: 'State' },
  readOnly: { type: 'boolean', category: 'State' },
  onSelectionChange: { type: 'action', category: 'Events' },
  onActivate: { type: 'action', category: 'Events' },
} as const;

const explorerEvents = {
  selectionChange: {
    label: 'Selection change',
    eventType: 'explorer.selectionChange',
    payloadFields: [{ path: 'selectedIds', type: 'unknown' }],
  },
  activate: {
    label: 'Activate item',
    eventType: 'explorer.activate',
    payloadFields: [{ path: 'id', type: 'string' }],
  },
} as const;

/** Framework-bound Explorer is a composition primitive, not a separate manifest shape. */
export const explorerMeta = {
  name: 'Explorer',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  props: {},
} as const satisfies ZoraComponentMeta;

export const mediaExplorerMeta = {
  name: 'MediaExplorer',
  category: 'pattern',
  description: 'Virtualized media library with normalized selection and activation events.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Media explorer', defaultProps: { items: [], selectionMode: 'single', tileSize: 120 } },
  events: explorerEvents,
  props: explorerProps,
} as const satisfies ZoraComponentMeta;

export const fileExplorerMeta = {
  name: 'FileExplorer',
  category: 'pattern',
  description: 'Virtualized file and folder collection with normalized selection and activation.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'File explorer', defaultProps: { items: [], selectionMode: 'single', tileSize: 120 } },
  events: explorerEvents,
  props: explorerProps,
} as const satisfies ZoraComponentMeta;
