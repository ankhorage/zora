import type { ZoraComponentMeta } from '../authoring';
export const formMeta = {
  name: 'Form',
  category: 'component',
  directManifestNode: true,
  allowedChildren: ['FormError', 'Field'],
  blueprint: {
    label: 'Form',
    defaultProps: { submitLabel: 'Submit', loading: false, disabled: false },
  },
  bindings: {
    events: {
      submit: {
        label: 'Submit',
        description: 'Runs when the form is submitted.',
        payload: { eventType: 'form.submit', fields: [] },
      },
    },
  },
  events: {
    submit: {
      label: 'Submit',
      eventType: 'form.submit',
      description: 'Emitted when the form is submitted.',
      payloadFields: [],
    },
  },
  slots: { actions: { label: 'Actions', allowedChildren: ['Button', 'ButtonGroup'] } },
  props: {
    submitLabel: { type: 'string', category: 'Content', label: 'Submit label', default: 'Submit' },
    loading: { type: 'boolean', category: 'State', label: 'Loading', default: false },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
  },
} as const satisfies ZoraComponentMeta;
