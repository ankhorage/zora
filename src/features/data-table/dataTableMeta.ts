import type { ZoraComponentMeta } from '../../types/authoring';

export const dataTableMeta = {
  name: 'DataTable',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Data table', defaultProps: { rows: [], columns: [], rowKey: 'id' } },
  events: {
    sortChange: {
      label: 'Sort change',
      eventType: 'dataTable.sortChange',
      payloadFields: [
        { path: 'columnId', type: 'string' },
        { path: 'direction', type: 'string' },
      ],
    },
    selectionChange: {
      label: 'Selection change',
      eventType: 'dataTable.selectionChange',
      payloadFields: [{ path: 'selectedRowIds', type: 'unknown', label: 'Selected row IDs' }],
    },
    rowActivate: {
      label: 'Activate row',
      eventType: 'dataTable.rowActivate',
      payloadFields: [{ path: 'rowId', type: 'string', label: 'Row ID' }],
    },
  },
  bindings: {
    props: {
      sort: {
        value: {
          type: 'object',
          fields: [
            { path: 'columnId', type: 'string' },
            { path: 'direction', type: 'string' },
          ],
        },
        acceptsFallback: true,
      },
      selectedRowIds: {
        label: 'Selected row IDs',
        description: 'Controlled stable row identities selected with the checkbox column.',
        value: { type: 'array' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
    events: {
      selectionChange: {
        label: 'Selection change',
        payload: {
          eventType: 'dataTable.selectionChange',
          fields: [{ path: 'selectedRowIds', type: 'unknown', label: 'Selected row IDs' }],
        },
      },
      rowActivate: {
        label: 'Activate row',
        payload: {
          eventType: 'dataTable.rowActivate',
          fields: [{ path: 'rowId', type: 'string', label: 'Row ID' }],
        },
      },
    },
  },
  props: {
    rows: { type: 'array', category: 'Data' },
    rowKey: { type: 'string', category: 'Identity', label: 'Row identity field' },
    columns: {
      type: 'array',
      category: 'Data',
      itemSchema: [
        { key: 'id', schema: { type: 'string', category: 'Identity' } },
        { key: 'header', schema: { type: 'string', category: 'Content' } },
        { key: 'accessor', schema: { type: 'string', category: 'Data' } },
        {
          key: 'align',
          schema: { type: 'enum', category: 'Layout', enum: ['start', 'center', 'end'] },
        },
        { key: 'width', schema: { type: 'number', category: 'Layout' } },
        { key: 'minWidth', schema: { type: 'number', category: 'Layout' } },
        { key: 'sortable', schema: { type: 'boolean', category: 'Behavior' } },
        {
          key: 'cell',
          schema: {
            type: 'object',
            category: 'Content',
            label: 'Portable cell presentation',
          },
        },
      ],
    },
    selectedRowIds: { type: 'array', category: 'Selection', label: 'Selected row IDs' },
    loading: { type: 'boolean', category: 'State' },
    loadingRows: { type: 'number', category: 'State' },
    emptyTitle: { type: 'string', category: 'Content' },
    emptyDescription: { type: 'string', category: 'Content' },
    density: { type: 'enum', category: 'Layout', enum: ['comfortable', 'compact'] },
  },
} as const satisfies ZoraComponentMeta;
