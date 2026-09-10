import type { ZoraComponentMeta } from '../../metadata/types';

export const chipGroupMeta = {
  name: 'ChipGroup',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Chip group', defaultProps: { items: [] } },
  events: {
    valueChange: {
      label: 'Selection change',
      eventType: 'chipGroup.valueChange',
      payloadFields: [{ path: 'value', type: 'unknown' }],
    },
  },
  bindings: { props: { value: { value: { type: 'unknown' }, acceptsFallback: true } } },
  props: {
    items: {
      type: 'array',
      category: 'Content',
      itemSchema: [
        { key: 'value', schema: { type: 'string', category: 'Identity' } },
        { key: 'label', schema: { type: 'string', category: 'Content' } },
        { key: 'disabled', schema: { type: 'boolean', category: 'State' } },
      ],
    },
    multiple: { type: 'boolean', category: 'Selection' },
    wrap: { type: 'boolean', category: 'Layout' },
    disabled: { type: 'boolean', category: 'State' },
    size: { type: 'enum', category: 'Style', enum: ['s', 'm', 'l'] },
  },
} as const satisfies ZoraComponentMeta;
