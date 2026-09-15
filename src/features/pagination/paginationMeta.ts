import type { ZoraComponentMeta } from '../../types/authoring';

export const paginationMeta = {
  name: 'Pagination',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  description: 'Navigates between pages of a finite result set without changing app routes.',
  blueprint: {
    label: 'Pagination',
    defaultProps: { boundaryCount: 1, compact: false, page: 1, pageCount: 10, siblingCount: 1 },
  },
  bindings: {
    props: {
      page: {
        label: 'Page',
        description: 'Current one-based page.',
        value: { type: 'number' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
    events: {
      pageChange: {
        label: 'Page change',
        description: 'Runs when a new page is requested.',
        payload: {
          eventType: 'pagination.pageChange',
          fields: [{ path: 'page', type: 'number', label: 'Page' }],
        },
      },
    },
  },
  events: {
    pageChange: {
      label: 'Page change',
      eventType: 'pagination.pageChange',
      payloadFields: [{ path: 'page', type: 'number', label: 'Page' }],
    },
  },
  props: {
    page: { type: 'number', category: 'State', label: 'Page', default: 1 },
    pageCount: { type: 'number', category: 'Data', label: 'Page count', default: 10 },
    siblingCount: { type: 'number', category: 'Layout', label: 'Sibling count', default: 1 },
    boundaryCount: { type: 'number', category: 'Layout', label: 'Boundary count', default: 1 },
    showFirstLast: { type: 'boolean', category: 'Behavior', label: 'Show first/last' },
    compact: { type: 'boolean', category: 'Layout', label: 'Compact', default: false },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled' },
    previousLabel: { type: 'string', category: 'Content', label: 'Previous label' },
    nextLabel: { type: 'string', category: 'Content', label: 'Next label' },
    firstLabel: { type: 'string', category: 'Content', label: 'First label' },
    lastLabel: { type: 'string', category: 'Content', label: 'Last label' },
  },
} as const satisfies ZoraComponentMeta;
