import type { ZoraComponentMeta } from '../../../types/authoring';

export const searchInputMeta = {
  name: 'SearchInput',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  description: 'Search-focused text input with clear and submit events.',
  blueprint: {
    label: 'Search input',
    defaultProps: { clearable: true, placeholder: 'Search', size: 'l', value: '' },
  },
  bindings: {
    props: {
      value: {
        label: 'Value',
        description: 'Current search query.',
        value: { type: 'string' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
    events: {
      valueChange: {
        label: 'Value change',
        description: 'Runs whenever the search query changes.',
        payload: {
          eventType: 'searchInput.valueChange',
          fields: [{ path: 'value', type: 'string', label: 'Value' }],
        },
      },
      submit: {
        label: 'Submit',
        description: 'Runs when the user submits the search query.',
        payload: {
          eventType: 'searchInput.submit',
          fields: [{ path: 'value', type: 'string', label: 'Value' }],
        },
      },
      clear: {
        label: 'Clear',
        description: 'Runs when the search query is cleared.',
        payload: { eventType: 'searchInput.clear', fields: [] },
      },
    },
  },
  events: {
    valueChange: {
      label: 'Value change',
      eventType: 'searchInput.valueChange',
      payloadFields: [{ path: 'value', type: 'string', label: 'Value' }],
    },
    submit: {
      label: 'Submit',
      eventType: 'searchInput.submit',
      payloadFields: [{ path: 'value', type: 'string', label: 'Value' }],
    },
    clear: { label: 'Clear', eventType: 'searchInput.clear', payloadFields: [] },
  },
  props: {
    value: { type: 'string', category: 'Content', label: 'Value', default: '' },
    placeholder: { type: 'string', category: 'Content', label: 'Placeholder', default: 'Search' },
    clearable: { type: 'boolean', category: 'Behavior', label: 'Clearable', default: true },
    size: { type: 'enum', category: 'Style', label: 'Size', enum: ['s', 'm', 'l'], default: 'l' },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled' },
    readOnly: { type: 'boolean', category: 'State', label: 'Read only' },
  },
} as const satisfies ZoraComponentMeta;
