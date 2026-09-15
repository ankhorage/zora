import type { ZoraComponentMeta } from '../authoring';
export const formErrorMeta = {
  name: 'FormError',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Form error', defaultProps: { error: 'Unable to submit the form.' } },
  bindings: {
    props: {
      error: {
        label: 'Error',
        description: 'Global form or submission error.',
        value: { type: 'unknown' },
        acceptsFallback: true,
      },
    },
  },
  props: { error: { type: 'string', category: 'Content', label: 'Error' } },
} as const satisfies ZoraComponentMeta;
