import type { ZoraComponentMeta } from '../../metadata/types';

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
      ],
    },
    loading: { type: 'boolean', category: 'State' },
    loadingRows: { type: 'number', category: 'State' },
    emptyTitle: { type: 'string', category: 'Content' },
    emptyDescription: { type: 'string', category: 'Content' },
    density: { type: 'enum', category: 'Layout', enum: ['comfortable', 'compact'] },
  },
} as const satisfies ZoraComponentMeta;
